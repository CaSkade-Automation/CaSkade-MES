import { SkillExecutor } from './SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { GraphDbConnectionService } from 'util/GraphDbConnection.service';
import { SparqlResultConverter } from 'sparql-result-converter';
import { opcUaSkillExecutionMapping, opcUaSkillParameterMapping } from './skill-execution-mappings';
import { MessageSecurityMode, SecurityPolicy, OPCUAClient, ConnectionStrategy, UserNameIdentityToken, NodeId, NodeIdType } from 'node-opcua';
import { InternalServerErrorException } from '@nestjs/common';
import { SkillParameterDto } from '@shared/models/skill/SkillParameter';

export class OpcUaSkillExecutionService implements SkillExecutor{

    connectionStrategy: ConnectionStrategy = {
        initialDelay: 1000,
        maxRetry: 1,
        maxDelay: 10000,
        randomisationFactor: 0.5
    };

    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private converter = new SparqlResultConverter()) {
    }

    async setSkillParameters(skillIri: string, parameters: SkillParameterDto[]): Promise<void> {
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
            console.log("connected !");

            // step 2 : createSession
            // const session = await client.createSession(userIdentityToken);
            const session = await client.createSession();
            console.log("session created !");

            for (const param of parameterDescription.parameters) {
                const foundReqParam = parameters.find(reqParam => reqParam.parameterName == param.parameterName);
                if(foundReqParam && foundReqParam.parameterValue) {
                    const dataToWrite: any = {
                        dataType: "UInt32",
                        value: foundReqParam.parameterValue
                    };
                    console.log("data to write");
                    console.log(dataToWrite);

                    // Note: This is how you create a node ID
                    const paramNodeId = new NodeId(NodeIdType.STRING, param.parameterNodeId,4);

                    console.log("nodeId");

                    console.log(paramNodeId);

                    await session.writeSingleNode(paramNodeId, dataToWrite, (err, res) => {
                        console.log("value written");
                        console.log(err);
                        console.log(res);
                        console.log("asdasda \n");
                    });

                }

            }
        } catch(err) {
            console.log(err);
        }
    }




    // TODO: Make sure that all required variables are present and that variables get sent first before calling the method
    async executeSkill(executionRequest: SkillExecutionRequestDto): Promise<any> {
        console.log("trying to set params");

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
            console.log("connected !");

            // step 2 : createSession
            // const session = await client.createSession(userIdentityToken);
            const session = await client.createSession();
            console.log("session created !");

            // step 3: write all variables

            for (const param of skillDescription.parameters) {
                const foundReqParam = executionRequest.parameters.find(reqParam => reqParam.name == param.parameterName);
                if(foundReqParam && foundReqParam.value) {
                    const dataToWrite: any = {
                        dataType: "Int32",
                        value: foundReqParam.value
                    };
                    console.log("data to write");
                    console.log(dataToWrite);

                    await session.writeSingleNode(param.parameterNodeId, dataToWrite, (err, res) => {
                        console.log("value written");
                        console.log(err);
                        console.log(res);
                        console.log("asdasda \n");
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
            const methodToCall = {
                objectId: skillDescription.skillNodeId,
                methodId: skillDescription.methodNodeId,
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


    // const connectionStrategy = {
    //     initialDelay: 1000,
    //     maxRetry: 1
    //   }

    //   // Set options e.g. for security and similar things
    //   const options = {
    //     applicationName: "OPS OPC UA Capability Executor",
    //     connectionStrategy: connectionStrategy,
    //     securityMode: MessageSecurityMode.None,
    //     securityPolicy: SecurityPolicy.None,
    //     endpoint_must_exist: false,
    //   };

    //   // User identityToken has to be used for secure access
    //   // const userIdentityToken = {
    //   //   password: "password1",
    //   //   userName: "user",
    //   //   type: UserTokenType.UserName
    //   // };

    //   const client = OPCUAClient.create(options);
    //   // const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543";
    //   const endpointUrl = "opc.tcp://localhost:4840";



    //   async function main() {
    //     try {
    //       // step 1 : connect to the endpoint url
    //       await client.connect(endpointUrl);
    //       console.log("connected !");

    //       // step 2 : createSession
    //       // const session = await client.createSession(userIdentityToken);
    //       const session = await client.createSession();
    //       console.log("session created !");

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

    //       // step 5: call a method. First construct a methodToCall object
    //       const methodToCall = {
    //         objectId: "ns=2;s=Beispiel",
    //         methodId: "ns=2;s=Beispiel/SimpleMethode",
    //         inputArguments: [{
    //             dataType: 11,
    //             value: 36
    //           },
    //           {
    //             dataType: 11,

    async getOpcUaSkillDescription(skillIri: string, commandTypeIri: string): Promise<OpcUaSkill> {
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
        const mappedResult = <unknown>this.converter.convert(queryResult.results.bindings, opcUaSkillExecutionMapping)[0] as OpcUaSkillQueryResult;

        const opcUaSkillDescription = new OpcUaSkill(skillIri, commandTypeIri, mappedResult);
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
        const mappedResult = <unknown>this.converter.convert(queryResult.results.bindings, opcUaSkillParameterMapping)[0] as OpcUaSkillParameterResult;

        // const opcUaSkillDescription = new OpcUaSkill(skillIri, commandTypeIri, mappedResult);
        return mappedResult;
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


    private createUserIdentityToken(securityPolicy: SecurityPolicy, skillDescription: OpcUaSkill): UserNameIdentityToken {
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

class OpcUaSkill {
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



