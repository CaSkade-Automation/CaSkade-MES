import { AttributeIds, BrowseDescription, BrowseDirection, CallMethodRequestOptions,
    CallMethodResult,DataType, NodeId, NodeIdType,
    StatusCode, WriteValue } from "node-opcua";
import { SkillService } from "../../../../routes/skills/skill.service";
import { SparqlResultConverter } from "sparql-result-converter";
import { GraphDbConnectionService } from "../../../../util/GraphDbConnection.service";
import { opcUaSkillParameterMapping } from "../skill-execution-mappings";
import { SkillExecutor } from "../SkillExecutor";
import { SkillExecutionRequestDto } from "@shared/models/skill/SkillExecutionRequest";
import { OpcUaSessionManager } from "../../../../util/OpcUaSessionManager";

/**
 * Abstract class wrapping OPC UA client functionality that contains methods for both types of OPC UA skills
 */
export abstract class OpcUaSkillExecutor extends SkillExecutor {

    protected converter = new SparqlResultConverter();

    constructor(
        protected graphDbConnection: GraphDbConnectionService,
        protected sessionManager: OpcUaSessionManager
    ) {
        super();
    }

    async setSkillParameters(executionRequest: SkillExecutionRequestDto): Promise<void> {
        const parameterDescription = await this.getOpcUaParameterDescription(executionRequest.skillIri);
        const requestParameters = executionRequest.parameters;

        // Match the parameters and write them. TODO: Align this with the base class' function "matchParameters"
        for (const describedParam of parameterDescription.parameters) {
            const foundReqParam = requestParameters.find(reqParam => reqParam.name == describedParam.parameterName);
            if(foundReqParam && foundReqParam.value) {

                try {
                    const res = await this.writeSingleNode(executionRequest.skillIri, describedParam.parameterNodeId, foundReqParam.value);
                    console.log(res);
                } catch (err) {
                    console.log(`Error while writing value: ${err}`);
                }
            }
        }

    }


    protected async getOpcUaParameterDescription(skillIri: string): Promise<OpcUaSkillParameterResult> {
        const query = `
        PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
        PREFIX OpcUa: <http://www.w3id.org/hsu-aut/OpcUa#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
        SELECT ?skillIri ?endpointUrl ?messageSecurityMode ?securityPolicy ?username ?password ?parameterIri ?parameterRequired
            ?parameterName ?parameterType ?parameterUaType ?parameterNodeId WHERE {
            BIND(<${skillIri}> AS ?skillIri).
            ?skillIri CSS:accessibleThrough ?skillInterface.
            ?uaServer OpcUa:hasNodeSet/OpcUa:containsNode ?skillInterface;
                OpcUa:hasEndpointUrl ?endpointUrl;
                OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                OpcUa:hasSecurityPolicy ?securityPolicy.
            OPTIONAL {
                ?uaServer OpcUa:requiresUserName ?username;
                    OpcUa:requiresPassword ?password.
            }
            OPTIONAL {
                ?skillIri CSS:hasParameter ?parameterIri.
                ?parameterIri a CSS:SkillParameter;
                    CaSk:hasVariableName ?parameterName;
                    CaSk:hasVariableType ?parameterType;
                    CaSk:isRequired ?parameterRequired;
                    OpcUa:nodeId ?parameterNodeId.
            }
        }`;
        //OpcUa:hasDataType ?parameterUaType.
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, opcUaSkillParameterMapping)
            .getFirstRootElement()[0] as OpcUaSkillParameterResult;

        // const opcUaSkillDescription = new OpcUaSkill(skillIri, commandTypeIri, mappedResult);
        return mappedResult;
    }

    /**
     * Wrapper around the node-opc-ua function writeSingleNode() that takes care of "preparation steps"
     * @param session An active ClientSession to an OPC UA server
     * @param nodeIdString ID of the Node to write
     * @param value Value to set
     */
    protected async writeSingleNode(skillIri: string, nodeIdString: string, value: any, namespace?: string): Promise<StatusCode> {

        const uaSession = await this.sessionManager.getSession(skillIri);

        // Problem: Some UA servers provide full nodeID string that can be parsed, others don't (they provide namespace separately)
        // Solution: Try to get a proper nodeId by trying to resolve the whole string. If it fails -> try with the separate namespace
        let nodeId: NodeId;
        try {
            nodeId = NodeId.resolveNodeId(nodeIdString);
        } catch (error) {
            // if nodeId cannot be resolved, try to do it manually
            let nsIndex = Number(namespace);    // namespace could also be stored as index
            if(!nsIndex) {
                nsIndex = uaSession.getNamespaceIndex(namespace);  // if not stored as index, try to get index
            }
            nodeId = new NodeId(NodeIdType.STRING, nodeIdString, nsIndex);
        }

        const nodeType = await uaSession.getBuiltInDataType(nodeId);

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

        return uaSession.write(writeValue);
    }


    /**
     * Wrapper around the node-opc-ua call() that takes care of "preparation steps"
     * @param session An active ClientSession to an OPC UA server
     * @param methodNodeId NodeId of the method to be called
     */
    protected async callMethod(skillIri: string, methodNodeId: string): Promise<CallMethodResult> {
        const uaSession = await this.sessionManager.getSession(skillIri);
        const methodNode = NodeId.resolveNodeId(methodNodeId);

        // Browse parent node -> This will be the object node
        const browseDesc = new BrowseDescription({
            nodeId: methodNode,
            browseDirection: BrowseDirection.Inverse,
            resultMask: 1
        });
        const browseResult = await uaSession.browse(browseDesc);
        const parentNode = browseResult.references[0].nodeId;

        const methodToCall: CallMethodRequestOptions = {
            objectId: parentNode,
            methodId: methodNode,
            inputArguments: []
        };

        return uaSession.call(methodToCall);
    }

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
