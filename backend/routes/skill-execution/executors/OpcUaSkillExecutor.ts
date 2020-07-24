import { SkillExecutor } from '../SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { GraphDbConnectionService } from 'util/GraphDbConnection.service';
import { SparqlResultConverter } from 'sparql-result-converter';
import { opcUaSkillExecutionMapping } from './skill-execution-mappings';
import { MessageSecurityMode, SecurityPolicy, OPCUAClient, ConnectionStrategy, UserIdentityToken, UserTokenType, UserNameIdentityToken } from 'node-opcua';
import { InternalServerErrorException } from '@nestjs/common';
import { Skill } from '../../../../shared/models/skill/Skill';
import { exec } from 'child_process';
import { SkillParameter } from '../../../../shared/models/skill/SkillParameter';

export class OpcUaSkillExecutionService implements SkillExecutor{

    connectionStrategy: ConnectionStrategy = {
        initialDelay: 1000,
        maxRetry: 1,
        maxDelay: 10000,
        randomisationFactor: 2
    };

    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private converter = new SparqlResultConverter()) {
    }


    // TODO: Make sure that all required variables are present and that variables get sent first before calling the method
    async executeSkill(executionRequest: SkillExecutionRequestDto): Promise<any> {
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
            console.log("params of description");
            console.log(skillDescription.parameters);

            console.log("params of req");
            console.log(executionRequest.parameters);

            // for (const param of skillDescription.parameters) {
            //     const paramValue = executionRequest.parameters.find(reqParam => {reqParam.name == param.name;});
            //     const dataToWrite: any = {
            //         dataType: param.type,
            //         value: paramValue
            //     };
            //     await session.writeSingleNode(param.paramNodeId, dataToWrite);
            //     console.log("value written");
            // }


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
                console.log(err);
                console.log(res);
            });

            session.close(true);
            client.disconnect();
        } catch {
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
        SELECT ?skillNodeId ?skillMethod ?methodNodeId ?endpointUrl ?messageSecurityMode ?securityPolicy ?userName ?password
            ?parameter ?paramRequired ?paramName ?paramType ?paramNodeId WHERE {
            <${skillIri}> a Cap:OpcUaSkill;
                        OpcUa:nodeId ?skillNodeId.
            ?uaServer OpcUa:hasNodeSet/OpcUa:containsNode <${skillIri}>;
                                      OpcUa:hasEndpointUrl ?endpointUrl;
                                      OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                                      OpcUa:hasSecurityPolicy ?securityPolicy.
            <${commandTypeIri}> rdfs:subClassOf ISA88:Transition.
            ?command a <${commandTypeIri}>;
                Cap:invokedBy ?skillMethod.
            ?skillMethod a OpcUa:UAMethod;
                OpcUa:componentOf <${skillIri}>;
                OpcUa:nodeId ?methodNodeId.
            OPTIONAL {
                <${skillIri}> Cap:hasSkillParameter ?parameter.
                ?parameter a Cap:SkillParameter;
                    Cap:hasVariableName ?paramName;
                    Cap:hasVariableType ?paramType;
                    Cap:isRequired ?paramRequired;
                    OpcUa:nodeId ?paramNodeId.
            }
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = <unknown>this.converter.convert(queryResult.results.bindings, opcUaSkillExecutionMapping)[0] as OpcUaSkillQueryResult;

        console.log(mappedResult);

        const opcUaSkillDescription = new OpcUaSkill(skillIri, commandTypeIri, mappedResult);
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



class OpcUaSkillQueryResult {
    skillNodeId: string;
    skillMethod: string;
    methodNodeId: string;
    endpointUrl: string;
    messageSecurityMode: string;
    securityPolicy: string;
    username: string;
    password: string;
    params: {
        paramName: string,
        paramType: string,
        isRequired: boolean,
        paramNodeId: string
    }[];
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
    get parameters(): any[] { return this.skillQueryResult.params;}
}



