import { SkillExecutor } from './SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { GraphDbConnectionService } from 'util/GraphDbConnection.service';
import { SparqlResultConverter } from 'sparql-result-converter';
import { opcUaSkillExecutionMapping, opcUaSkillParameterMapping } from './skill-execution-mappings';
import { MessageSecurityMode, SecurityPolicy, OPCUAClient, ConnectionStrategy, UserNameIdentityToken, NodeId, makeBrowsePath, AttributeIds} from 'node-opcua';
import { InternalServerErrorException } from '@nestjs/common';
import { SkillVariableDto } from '@shared/models/skill/SkillVariable';
import { SkillService } from 'routes/skills/skill.service';


// TODO: There is a lot to clean up here...
export class OpcUaSkillExecutionService extends SkillExecutor{

    connectionStrategy: ConnectionStrategy = {
        initialDelay: 1000,
        maxRetry: 1,
        maxDelay: 10000,
        randomisationFactor: 0.5
    };

    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private skillService: SkillService,
        private converter = new SparqlResultConverter()) {
        super();
    }

    async setSkillParameters(skillIri: string, parameters: SkillVariableDto[]): Promise<void> {
        const parameterDescription = await this.getOpcUaParameterDescription(skillIri);

        const messageSecurityMode = this.getMessageSecurityMode(parameterDescription.messageSecurityMode);
        const securityPolicy = this.getSecurityPolicy(parameterDescription.securityPolicy);
        // Set options e.g. for security and similar things
        const options = {
            applicationName: "OPS OPC UA Capability Executor",
            connectionStrategy: this.connectionStrategy,
            securityMode: messageSecurityMode,
            securityPolicy: SecurityPolicy.None,
            endpoint_must_exist: false,
        };

        // Create a userIdentityToken depending on the securityPolicy
        // const userIdToken = this.createUserIdentityToken(securityPolicy, parameterDescription);
        try {

            const client = OPCUAClient.create(options);
            const endpointUrl = parameterDescription.endpointUrl;

            // step 1 : connect to the endpoint url
            await client.connect(endpointUrl);

            // step 2 : createSession
            // const session = await client.createSession(userIdentityToken);
            const session = await client.createSession();

            for (const param of parameterDescription.parameters) {
                const foundReqParam = parameters.find(reqParam => reqParam.name == param.parameterName);
                if(foundReqParam && foundReqParam.value) {
                    // get node data type. TODO: Check if there's a better way...
                    const node = NodeId.resolveNodeId(param.parameterNodeId);
                    const nodeType = await session.getBuiltInDataType(node);

                    const dataToWrite: any = {
                        dataType: nodeType,
                        value: foundReqParam.value
                    };

                    session.writeSingleNode(node, dataToWrite, (err, res) => {
                        console.log("value written");
                        console.log(err);
                        console.log(res);
                    });

                }

            }
        } catch(err) {
            console.log(err);
        }
    }

    async getSkillOutputs(executionRequest: SkillExecutionRequestDto): Promise<unknown> {
        const skill = await this.skillService.getSkillByIri(executionRequest.skillIri);
        const outputDtos = skill.skillOutputsDtos;

        if (outputDtos == undefined || outputDtos.length == 0 ) return null;

        const skillMethodDescription = await this.getStatelessOpcUaMethodDescription(executionRequest.skillIri, executionRequest.commandTypeIri);

        console.log("stateless skil");
        console.log(skillMethodDescription);

        const messageSecurityMode = this.getMessageSecurityMode(skillMethodDescription.messageSecurityMode);
        const securityPolicy = this.getSecurityPolicy(skillMethodDescription.securityPolicy);
        // Set options e.g. for security and similar things
        const options = {
            applicationName: "OPS OPC UA Capability Executor",
            connectionStrategy: this.connectionStrategy,
            securityMode: messageSecurityMode,
            securityPolicy: SecurityPolicy.None,
            endpoint_must_exist: false,
        };

        // Create a userIdentityToken depending on the securityPolicy
        const userIdToken = this.createUserIdentityToken(securityPolicy, skillMethodDescription);

        const client = OPCUAClient.create(options);
        const endpointUrl = skillMethodDescription.endpointUrl;

        try {
            // step 1 : connect to the endpoint url
            await client.connect(endpointUrl);

            // step 2 : createSession
            // const session = await client.createSession(userIdentityToken);
            const session = await client.createSession();

            // step 3: call the method. First construct a methodToCall object
            const skillNode = NodeId.resolveNodeId(skillMethodDescription.skillNodeId);
            const methodNode = NodeId.resolveNodeId(skillMethodDescription.methodNodeId);

            const methodToCall = {
                objectId: skillNode,
                methodId: methodNode,
                inputArguments: []
            };

            const [output] =await session.translateBrowsePath([
                makeBrowsePath(methodNode,".OutputArguments"),
            ]);
            const outputArgumentNodeId  =  output.targets[0].targetId;
            const nodesToRead = [
                { attributeIds: AttributeIds.Value, nodeId: outputArgumentNodeId },
            ];
            const [outputArgumentValue]  = await session.read(nodesToRead);

            console.log("output");
            console.dir(outputArgumentValue.value, {depth:null});
            console.log("output name");
            console.log(outputArgumentValue.value.value);

            // get the raw method output that does not contain output argument names
            const result = (await session.call(methodToCall)).outputArguments;

            for (let i = 0; i < result.length; i++) {
                result[i]["name"] = outputArgumentValue.value.value[i].name;
            }



            outputDtos.forEach(output => {
                console.log("result");
                console.log(result);

                const matchingResult = result.find(res => res["name"] == output.name);
                output.value = matchingResult.value;
            });


            // TODO: Create real skill outputs here..
            console.log("final result");
            console.log(result);


            session.close(true);
            client.disconnect();

            return outputDtos;
        } catch (err) {
            console.log(err);

            throw new InternalServerErrorException();
        }

    }


    // TODO: Make sure that all required variables are present and that variables get sent first before calling the method
    async invokeTransition(executionRequest: SkillExecutionRequestDto): Promise<any> {
        const skillDescription = await this.getOpcUaSkillDescription(executionRequest.skillIri, executionRequest.commandTypeIri);

        const messageSecurityMode = this.getMessageSecurityMode(skillDescription.messageSecurityMode);
        const securityPolicy = this.getSecurityPolicy(skillDescription.securityPolicy);
        // Set options e.g. for security and similar things
        const options = {
            applicationName: "OPS OPC UA Capability Executor",
            connectionStrategy: this.connectionStrategy,
            securityMode: messageSecurityMode,
            securityPolicy: SecurityPolicy.None,
            endpoint_must_exist: false,
        };

        // Create a userIdentityToken depending on the securityPolicy
        const userIdToken = this.createUserIdentityToken(securityPolicy, skillDescription);


        const client = OPCUAClient.create(options);
        const endpointUrl = skillDescription.endpointUrl;


        try {
            // step 1 : connect to the endpoint url
            await client.connect(endpointUrl);

            // step 2 : createSession
            // const session = await client.createSession(userIdentityToken);
            const session = await client.createSession();

            // step 3: write all variables

            for (const param of skillDescription.parameters) {
                const foundReqParam = executionRequest.parameters.find(reqParam => reqParam.name == param.parameterName);
                if(foundReqParam && foundReqParam.value) {
                    const node = NodeId.resolveNodeId(param.parameterNodeId);
                    const nodeType = await session.getBuiltInDataType(node);

                    const dataToWrite: any = {
                        dataType: nodeType,
                        value: foundReqParam.value
                    };

                    await session.writeSingleNode(param.parameterNodeId, dataToWrite, (err, res) => {
                        console.log("value written");
                        console.log(err);
                        console.log(res);
                    });

                }

            }



            //       // step 3 : browse
            //       const browseResult = await session.browse("RootFolder");

            //       console.log("references of RootFolder :");
            //       for (const reference of browseResult.references) {
            //         console.log("   -> ", reference.browseName.toString());
            //       }

            //       // step 4 : read a variable with readVariableValue
            //       const maxAge = 0;
            //       const nodeToRead = {
            //         nodeId: "ns=2;s=Methods/sqrt(x)",
            //         attributeId: AttributeIds.Value
            //       };
            //       const dataValue = await session.read(nodeToRead, maxAge);
            //       console.log(" value ", dataValue);

            //       const browsedNode = await session.browse("ns=4;s=|var|CODESYS Control Win V3 x64.Application.PLC_PRG.output");
            //       console.log(`browsedNode`, browsedNode.toString());
            //       console.log('\nExploring:\n', );



            //       // // step 4: read a variable with read
            //       const dataValue2 = await session.readVariableValue("ns=4;s=|var|CODESYS Control Win V3 x64.Application.PLC_PRG.output");
            //       console.log(" value = ", dataValue2.toString());

            //       console.log('\n**********************\nAttributes:');
            //       const attributes = await session.readAllAttributes("ns=4;s=|var|CODESYS Control Win V3 x64.Application.PLC_PRG.output");
            //       console.log(attributes);
            //       console.log('\n**********************');

            //       // step 5: write a variable, first create an object that holds an opc ua structure
            //       const dataToWrite = {
            //         dataType: "Boolean",
            //         value: true
            //       }
            //       await session.writeSingleNode("ns=4;s=|var|CODESYS Control Win V3 x64.Application.PLC_PRG.input", dataToWrite);
            //       console.log("value written");

            // step 5: call a method. First construct a methodToCall object
            const skillNode = NodeId.resolveNodeId(skillDescription.skillNodeId);
            const methodNode = NodeId.resolveNodeId(skillDescription.methodNodeId);

            const methodToCall = {
                objectId: skillNode,
                methodId: methodNode,
                inputArguments: []
            };

            session.call(methodToCall, (err, res) => {
                console.log("method called");
                console.log(err);
                console.log(res);
            });

            session.close(true);
            client.disconnect();

        } catch (err) {
            console.log(err);

            throw new InternalServerErrorException();
        }


        return skillDescription;
    }


    async getOpcUaSkillDescription(skillIri: string, commandTypeIri: string): Promise<OpcUaSkillMethod> {
        const query = `
        PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
        SELECT ?skillIri ?skillMethodIri ?skillNodeId ?methodNodeId ?endpointUrl ?messageSecurityMode ?securityPolicy ?userName ?password
            ?parameterIri ?parameterRequired ?parameterName ?parameterType ?parameterUaType ?parameterNodeId WHERE {
            BIND(<${skillIri}> AS ?skillIri).
            ?skillIri a Cap:OpcUaSkill;
                        OpcUa:nodeId ?skillNodeId.
            ?uaServer OpcUa:hasNodeSet/OpcUa:containsNode ?skillIri;
                                      OpcUa:hasEndpointUrl ?endpointUrl;
                                      OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                                      OpcUa:hasSecurityPolicy ?securityPolicy.
            <${commandTypeIri}> rdfs:subClassOf ISA88:Transition.
            ?command a <${commandTypeIri}>;
                Cap:invokedBy ?skillMethodIri.
            ?skillMethodIri a OpcUa:UAMethod;
                OpcUa:componentOf ?skillIri;
                OpcUa:nodeId ?methodNodeId.
            OPTIONAL {
                ?skillIri Cap:hasSkillParameter ?parameterIri.
                ?parameterIri a Cap:SkillParameter;
                    Cap:hasVariableName ?parameterName;
                    Cap:hasVariableType ?parameterType;
                    Cap:isRequired ?parameterRequired;
                    OpcUa:nodeId ?parameterNodeId;
                    OpcUa:hasDataType ?parameterUaType.
            }
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, opcUaSkillExecutionMapping).getFirstRootElement()[0] as OpcUaSkillQueryResult;

        const opcUaSkillDescription = new OpcUaSkillMethod(skillIri, commandTypeIri, mappedResult);
        return opcUaSkillDescription;
    }

    private async getOpcUaParameterDescription(skillIri: string): Promise<OpcUaSkillParameterResult> {
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


    async getStatelessOpcUaMethodDescription(skillIri: string, commandTypeIri: string): Promise<OpcUaSkillMethod> {
        const query = `
        PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
        SELECT ?skillIri ?skillMethodIri ?skillNodeId ?methodNodeId ?endpointUrl ?messageSecurityMode ?securityPolicy ?userName ?password
            ?parameterIri ?parameterRequired ?parameterName ?parameterType ?parameterUaType ?parameterNodeId WHERE {
            BIND(<${skillIri}> AS ?skillIri).
            ?skillIri a Cap:OpcUaSkill;
                        OpcUa:nodeId ?skillNodeId.
            ?uaServer OpcUa:hasNodeSet/OpcUa:containsNode ?skillIri;
                                      OpcUa:hasEndpointUrl ?endpointUrl;
                                      OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                                      OpcUa:hasSecurityPolicy ?securityPolicy.
            <${commandTypeIri}> rdfs:subClassOf Cap:SkillMethod.
            ?skillMethodIri a <${commandTypeIri}>;
                a OpcUa:UAMethod;
                OpcUa:componentOf ?skillIri;
                OpcUa:nodeId ?methodNodeId.
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, opcUaSkillExecutionMapping).getFirstRootElement()[0] as OpcUaSkillQueryResult;

        const opcUaSkillDescription = new OpcUaSkillMethod(skillIri, commandTypeIri, mappedResult);
        return opcUaSkillDescription;
    }

    private getMessageSecurityMode(messageSecurityModeString: string): MessageSecurityMode {
        switch (messageSecurityModeString) {
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

    // TODO: Implement
    private getSecurityPolicy(securityPolicyString: string): SecurityPolicy {
        return SecurityPolicy.None;
    }


    private createUserIdentityToken(securityPolicy: SecurityPolicy, skillDescription: OpcUaSkillMethod): UserNameIdentityToken {
        let userIdentityToken: UserNameIdentityToken;
        if(securityPolicy != SecurityPolicy.None) {
            userIdentityToken = new UserNameIdentityToken({
                userName: skillDescription.username,
                password: Buffer.from(skillDescription.password),
            });
        } else {
            return undefined;
        }
    }



}


// TODO: Align with SkillParameter, fix this mess
class OpcUaSkillQueryResult {
    skillNodeId: string;
    skillMethod: string;
    methodNodeId: string;
    endpointUrl: string;
    messageSecurityMode: string;
    securityPolicy: string;
    username: string;
    password: string;
    parameters: OpcUaSkillParameter[];
}

class OpcUaSkillParameterResult {
    endpointUrl: string;
    messageSecurityMode: string;
    securityPolicy: string;
    username: string;
    password: string;
    parameters: OpcUaSkillParameter[];
}

class OpcUaSkillParameter {
    parameterName: string;
    parameterType: string;
    parameterRequired: boolean;
    parameterNodeId: string
}

class OpcUaSkillMethod {
    private skillQueryResult: OpcUaSkillQueryResult;

    constructor(public skillIri: string, public commandTypeIri: string, skillQueryResult: OpcUaSkillQueryResult) {
        this.skillQueryResult = skillQueryResult;
    }

    get skillNodeId(): string { return this.skillQueryResult.skillNodeId;}
    get endpointUrl(): string { return this.skillQueryResult.endpointUrl;}
    get methodNodeId(): string { return this.skillQueryResult.methodNodeId;}
    get messageSecurityMode(): string { return this.skillQueryResult.messageSecurityMode;}
    get securityPolicy():string { return this.skillQueryResult.securityPolicy;}
    get username(): string { return this.skillQueryResult.username;}
    get password(): string { return this.skillQueryResult.password;}
    get parameters(): any[] { return this.skillQueryResult.parameters;}
}



