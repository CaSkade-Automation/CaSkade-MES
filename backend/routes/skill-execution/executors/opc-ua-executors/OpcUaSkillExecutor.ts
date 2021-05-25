import { AttributeIds, CallMethodResult, ClientSession, ConnectionStrategy, DataType, DataValue, DataValueLike, DataValueOptions, makeBrowsePath, MessageSecurityMode, NodeId, NodeIdType, OPCUAClient, OPCUAClientOptions, SecurityPolicy, StatusCode, UserNameIdentityToken, Variant, VariantOptions, WriteValue, WriteValueOptions } from "node-opcua";
import { SkillService } from "routes/skills/skill.service";
import { SparqlResultConverter } from "sparql-result-converter";
import { GraphDbConnectionService } from "util/GraphDbConnection.service";
import { SkillVariableDto } from "@shared/models/skill/SkillVariable";
import { opcUaSkillParameterMapping } from "../skill-execution-mappings";
import { SkillExecutor } from "../SkillExecutor";

/**
 * Abstract skill execution class that contains methods for both types of OPC UA skills
 */
export abstract class OpcUaSkillExecutor extends SkillExecutor {

    protected graphDbConnection: GraphDbConnectionService;
    protected skillService: SkillService;
    protected converter: SparqlResultConverter;

    protected uaClient: OPCUAClient;
    protected uaSession: ClientSession;

    connectionStrategy: ConnectionStrategy = {
        initialDelay: 1000,
        maxRetry: 1,
        maxDelay: 10000,
        randomisationFactor: 0.5
    };

    constructor(graphDbConnection: GraphDbConnectionService, skillIri: string) {
        super();
        this.graphDbConnection = graphDbConnection;
    }

    async connectAndCreateSession(skillIri: string): Promise<void> {
        const uaServerInfo = await this.getOpcUaServerInfo(skillIri);
        const options = this.createOptionsObject(uaServerInfo.messageSecurityMode, uaServerInfo.securityPolicy);
        const userIdToken = this.createUserIdentityToken(uaServerInfo.securityPolicy, uaServerInfo.username, uaServerInfo.password);
        this.uaClient = OPCUAClient.create(options);

        try {
            await this.uaClient.connect(uaServerInfo.endpointUrl);
        } catch (err) {
            console.log(`Error while connecting to UAServer at ${uaServerInfo.endpointUrl}. Err: ${err}`);
        }

        this.uaSession = await this.uaClient.createSession();             // TODO: Integrate user identity token here
    }


    async setSkillParameters(skillIri: string, parameters: SkillVariableDto[]): Promise<void> {
        const parameterDescription = await this.getOpcUaParameterDescription(skillIri);

        for (const param of parameterDescription.parameters) {
            const foundReqParam = parameters.find(reqParam => reqParam.name == param.parameterName);
            if(foundReqParam && foundReqParam.value) {

                try {
                    const res = await this.writeSingleNode(param.parameterNodeId, foundReqParam.value);
                    console.log(res);
                } catch (err) {
                    console.log(`Error while writing value: ${err}`);
                }

            }

        }

    }

    /**
     * Returns a proper node-opc-ua MessageSecurityMode from a given IRI
     * @param messageSecurityModeIri IRI of a MessageSecurityMode according to the OPC UA ontology
     */
    protected getMessageSecurityMode(messageSecurityModeIri: string): MessageSecurityMode {
        switch (messageSecurityModeIri) {
        case "http://www.hsu-ifa.de/ontologies/OpcUaMessageSecurityMode_None":
            return MessageSecurityMode.None;
        case "http://www.hsu-ifa.de/ontologies/OpcUaMessageSecurityMode_Sign":
            return MessageSecurityMode.Sign;
        case "http://www.hsu-ifa.de/ontologies/OpcUaMessageSecurityMode_SignAndEncrypt":
            return MessageSecurityMode.SignAndEncrypt;
        default:
            return MessageSecurityMode.None;
        }
    }

    // TODO: Implement similar to getMessageSecurityMode
    protected getSecurityPolicy(securityPolicyString: string): SecurityPolicy {
        return SecurityPolicy.None;
    }

    protected createUserIdentityToken(securityPolicyIri: string, user: string, password: string): UserNameIdentityToken {
        let userIdentityToken: UserNameIdentityToken;
        const securityPolicy = this.getSecurityPolicy(securityPolicyIri);
        if(securityPolicy != SecurityPolicy.None) {
            userIdentityToken = new UserNameIdentityToken({
                userName: user,
                password: Buffer.from(password),
            });
        } else {
            return undefined;
        }
    }

    createOptionsObject(messageSecurityModeIri: string, securityPolicyIri: string): OPCUAClientOptions {
        // TODO: Integrate SecurityPolicy
        const options : OPCUAClientOptions = {
            applicationName: "OPS OPC UA Capability Executor",
            connectionStrategy: this.connectionStrategy,
            securityMode: this.getMessageSecurityMode(messageSecurityModeIri),
            securityPolicy: this.getSecurityPolicy(securityPolicyIri),
            endpoint_must_exist: false,
        };

        return options;
    }

    /**
     * Get all info about an OPC UA server that is necessary to connect and create a session
     * @param skillIri IRI of the skill that the server contains
     */
    private async getOpcUaServerInfo(skillIri: string): Promise<OpcUaServerInfo> {
        const query = `
        PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        SELECT ?endpointUrl ?messageSecurityMode ?securityPolicy ?userName ?password WHERE {
            BIND(<${skillIri}> AS ?skillIri).
            ?skillIri a Cap:OpcUaSkill.
            ?uaServer OpcUa:hasNodeSet/OpcUa:containsNode ?skillIri;
                OpcUa:hasEndpointUrl ?endpointUrl;
                OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                OpcUa:hasSecurityPolicy ?securityPolicy.
            OPTIONAL {
                ?uaServer OpcUa:requiresUserName ?userName;
                    OpcUa:requiresPassword ?password.
            }
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const opcUaServerInfo = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, opcUaSkillParameterMapping).getFirstRootElement()[0] as Promise<OpcUaServerInfo>;

        return opcUaServerInfo;
    }

    protected async getOpcUaParameterDescription(skillIri: string): Promise<OpcUaSkillParameterResult> {
        const query = `
        PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
        SELECT ?skillIri ?endpointUrl ?messageSecurityMode ?securityPolicy ?userName ?password ?parameterIri ?parameterRequired
            ?parameterName ?parameterType ?parameterUaType ?parameterNodeId WHERE {
            BIND(<${skillIri}> AS ?skillIri).
            ?skillIri a Cap:OpcUaSkill.
            ?uaServer OpcUa:hasNodeSet/OpcUa:containsNode ?skillIri;
                                      OpcUa:hasEndpointUrl ?endpointUrl;
                                      OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                                      OpcUa:hasSecurityPolicy ?securityPolicy.
            OPTIONAL {
                ?skillIri Cap:hasSkillParameter ?parameterIri.
                ?parameterIri a Cap:SkillParameter;
                    Cap:hasVariableName ?parameterName;
                    Cap:hasVariableType ?parameterType;
                    Cap:isRequired ?parameterRequired;
                    OpcUa:nodeId ?parameterNodeId;
            }
        }`;
        //OpcUa:hasDataType ?parameterUaType.
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, opcUaSkillParameterMapping).getFirstRootElement()[0] as OpcUaSkillParameterResult;

        // const opcUaSkillDescription = new OpcUaSkill(skillIri, commandTypeIri, mappedResult);
        return mappedResult;
    }

    /**
     * Wrapper around the node-opc-ua function writeSingleNode() that takes care of "preparation steps"
     * @param session An active ClientSession to an OPC UA server
     * @param nodeIdString ID of the Node to write
     * @param value Value to set
     */
    protected async writeSingleNode(nodeIdString: string, value: any, namespace?: string): Promise<StatusCode> {
        // Problem: Some UA servers provide full nodeID string that can be parsed, others don't (they provide namespace separately)
        // Solution: Try to get a proper nodeId by trying to resolve the whole string. If it fails -> try with the separate namespace
        let nsIndex: number;
        let nodeId: NodeId;

        try {
            nodeId = NodeId.resolveNodeId(nodeIdString);
            nsIndex = nodeId.namespace;
        } catch (error) {
            nsIndex = this.uaSession.getNamespaceIndex(namespace);
            nodeId = new NodeId(NodeIdType.STRING, nodeIdString, nsIndex);
        }

        const nodeType = await this.uaSession.getBuiltInDataType(nodeId);

        const writeValue =  new WriteValue(
            {
                "nodeId": nodeId,
                "attributeId": AttributeIds.Value,
                "value": {
                    "value": {
                        "value": value,
                        "dataType": DataType[nodeType]
                    }
                }
            }
        );

        const opts : VariantOptions = {
            dataType: DataType[nodeType],
            value: value
        };
        const variant = new Variant(opts);

        const writeOptions: WriteValueOptions = {
            nodeId: nodeId,
            value: variant,
        };

        return this.uaSession.write(writeValue);
    }


    /**
     * Wrapper around the node-opc-ua call() that takes care of "preparation steps"
     * @param session An active ClientSession to an OPC UA server
     * @param objectNodeId NodeId of the object that contains the method
     * @param methodNodeId NodeId of the method to be called
     */
    protected async callMethod(objectNodeId: string, methodNodeId: string): Promise<CallMethodResult> {
        const objectNode = NodeId.resolveNodeId(objectNodeId);
        const methodNode = NodeId.resolveNodeId(methodNodeId);

        const methodToCall = {
            objectId: objectNode,
            methodId: methodNode,
            inputArguments: []
        };

        return this.uaSession.call(methodToCall);
    }

    protected endUaConnection(): void {
        this.uaSession.close(true);
        this.uaClient.disconnect();
    }

}


interface OpcUaServerInfo{
    endpointUrl: string;
    messageSecurityMode: string;
    securityPolicy: string;
    username: string;
    password: string;
}


export class OpcUaSkillParameterResult {
    endpointUrl: string;
    messageSecurityMode: string;
    securityPolicy: string;
    username: string;
    password: string;
    parameters: OpcUaSkillParameter[];
}


export class OpcUaSkillParameter {
    parameterName: string;
    parameterType: string;
    parameterRequired: boolean;
    parameterNodeId: string
}
