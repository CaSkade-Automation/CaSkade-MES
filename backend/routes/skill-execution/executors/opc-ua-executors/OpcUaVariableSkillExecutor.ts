import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { GraphDbConnectionService } from 'util/GraphDbConnection.service';
import { SparqlResultConverter } from 'sparql-result-converter';
import { opcUaVariableSkillMapping } from '../skill-execution-mappings';
import { SecurityPolicy, OPCUAClient, NodeId, makeBrowsePath, AttributeIds, ClientSubscription} from 'node-opcua';
import { InternalServerErrorException } from '@nestjs/common';
import { SkillVariableDto } from '@shared/models/skill/SkillVariable';
import { SkillService } from 'routes/skills/skill.service';
import { OpcUaSkillExecutor, OpcUaSkillParameter } from './OpcUaSkillExecutor';

/**
 * Skill executor for a skill whose transitions are fired by setting a command variable to a certain value
 */
export class OpcUaVariableSkillExecutionService extends OpcUaSkillExecutor{

    constructor(graphDbConnection: GraphDbConnectionService, skillService: SkillService, skillIri: string) {
        super(graphDbConnection, skillIri);
        this.graphDbConnection = graphDbConnection;
        this.skillService = skillService;
        this.converter = new SparqlResultConverter();
    }




    /**
     * Invoke a transition by setting a command variable to a certain, required value
     * @param executionRequest Object containing skillIri, transitionIri and all parameters with the values they have to be set to
     */
    async invokeTransition(executionRequest: SkillExecutionRequestDto): Promise<any> {
        const skillDescription = await this.getOpcUaVariableSkillDescription(executionRequest.skillIri, executionRequest.commandTypeIri);

        try {
            // Write all "normal" parameters first
            for (const param of skillDescription.parameters) {
                const foundReqParam = executionRequest.parameters.find(reqParam => reqParam.name == param.parameterName);
                if(foundReqParam && foundReqParam.value) {
                    await this.writeSingleNode(param.parameterNodeId, foundReqParam.value);
                }
            }
            // Then write the command parameter
            await this.writeSingleNode(skillDescription.commandNodeId, skillDescription.requiredCommandValue);

            // Specifically for OpcUaVariableSkills: This type of skills doesn't send feedback about state changes, has to be actively tracked here
            ClientSubscription.create(this.uaSession, {});

        } catch (err) {
            console.log(`Error while invoking transition "${executionRequest.commandTypeIri}" on skill "${executionRequest.skillIri}" err`);
            throw new InternalServerErrorException();
        } finally {
            this.endUaConnection();
        }
    }


    /**
     * Returns all outputs of the skill by reading the OPC UA nodes that are marked as skill outputs
     * @param executionRequest No
     */
    async getSkillOutputs(executionRequest?: SkillExecutionRequestDto): Promise<unknown> {
        const skill = await this.skillService.getSkillByIri(executionRequest.skillIri);
        const outputDtos = skill.skillOutputsDtos;

        if (outputDtos == undefined || outputDtos.length == 0 ) return null;

        const skillMethodDescription = await this.getOpcUaSkillOutputDescription(executionRequest.skillIri);


        // try {
        //     // step 3: call the method. First construct a methodToCall object
        //     const skillNode = NodeId.resolveNodeId(skillMethodDescription.skillNodeId);
        //     const methodNode = NodeId.resolveNodeId(skillMethodDescription.methodNodeId);

        //     const methodToCall = {
        //         objectId: skillNode,
        //         methodId: methodNode,
        //         inputArguments: []
        //     };

        //     const [output] =await this.uaSession.translateBrowsePath([
        //         makeBrowsePath(methodNode,".OutputArguments"),
        //     ]);
        //     const outputArgumentNodeId  =  output.targets[0].targetId;
        //     const nodesToRead = [
        //         { attributeIds: AttributeIds.Value, nodeId: outputArgumentNodeId },
        //     ];
        //     const [outputArgumentValue]  = await this.uaSession.read(nodesToRead);

        //     // get the raw method output that does not contain output argument names
        //     const result = (await this.uaSession.call(methodToCall)).outputArguments;

        //     for (let i = 0; i < result.length; i++) {
        //         result[i]["name"] = outputArgumentValue.value.value[i].name;
        //     }

        //     outputDtos.forEach(output => {
        //         const matchingResult = result.find(res => res["name"] == output.name);
        //         output.value = matchingResult.value;
        //     });

        //     this.uaSession.close(true);
        //     this.uaClient.disconnect();

        //     return outputDtos;
        // } catch (err) {
        //     console.log(err);

        //     throw new InternalServerErrorException();
        // }

    }


    async getOpcUaVariableSkillDescription(skillIri: string, commandTypeIri: string): Promise<OpcUaVariableSkill> {
        const query = `
		PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
		PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
		PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>#
		PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
		SELECT ?endpointUrl ?messageSecurityMode ?securityPolicy ?requiredCommandValue ?commandNodeId ?parameterIri
		?parameterRequired ?parameterName ?parameterType ?parameterNodeId WHERE {
			BIND(<${skillIri}> AS ?skillIri).
				?skillIri a Cap:OpcUaVariableSkill;
						  Cap:hasStateMachine/ISA88:hasTransition ?command.
				?uaServer OpcUa:hasNodeSet/OpcUa:containsNode ?commandParameter;
                    OpcUa:hasEndpointUrl ?endpointUrl;
                    OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                    OpcUa:hasSecurityPolicy ?securityPolicy.
                OPTIONAL {
                    ?uaServer OpcUa:requiresUserName ?userName;
                    OpcUa:requiresPassword ?password
                }
				<${commandTypeIri}> rdfs:subClassOf ISA88:Transition.
				?command a <${commandTypeIri}>;
					DINEN61360:has_Data_Element ?commandVariableDataElement.
				?commandVariableDataElement DINEN61360:has_Type_Description Cap:SkillCommandVariable_TD;
					DINEN61360:has_Instance_Description ?requiredCommand,
					?commandParameter.
				?requiredCommand DINEN61360:Expression_Goal "Requirement";
					DINEN61360:Value ?requiredCommandValue.
				?skillIri Cap:hasSkillCommand ?commandParameter.
				?commandParameter a Cap:SkillCommand;
					OpcUa:nodeId ?commandNodeId.
				# Exclude the commands, just get the other "normal" parameters
				OPTIONAL {
					?skillIri Cap:hasSkillParameter ?parameterIri.
					?parameterIri a Cap:SkillParameter;
					Cap:hasVariableName ?parameterName;
					Cap:hasVariableType ?parameterType;
					Cap:isRequired ?parameterRequired;
					OpcUa:nodeId ?parameterNodeId;
					FILTER NOT EXISTS {
						?parameterIri a Cap:SkillCommand.
					}
				}
		}`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, opcUaVariableSkillMapping).getFirstRootElement()[0] as OpcUaVariableSkill;

        // const opcUaSkillDescription = new OpcUaSkillMethod(skillIri, commandTypeIri, mappedResult);
        return mappedResult;
    }


    async getOpcUaSkillOutputDescription(skillIri: string): Promise<OpcUaVariableSkill> {
        const query = `
		PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
		PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
		PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>#
		PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
		SELECT ?endpointUrl ?messageSecurityMode ?securityPolicy ?requiredCommandValue ?commandNodeId ?parameterIri
		?parameterRequired ?parameterName ?parameterType ?parameterNodeId WHERE {
			BIND(<${skillIri}> AS ?skillIri).
				?skillIri a Cap:OpcUaVariableSkill;
						  Cap:hasStateMachine/ISA88:hasTransition ?command.
				?uaServer OpcUa:hasNodeSet/OpcUa:containsNode ?commandParameter;
                    OpcUa:hasEndpointUrl ?endpointUrl;
                    OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                    OpcUa:hasSecurityPolicy ?securityPolicy.
                OPTIONAL {
                    ?uaServer OpcUa:requiresUserName ?userName;
                    OpcUa:requiresPassword ?password
                }

				?commandVariableDataElement DINEN61360:has_Type_Description Cap:SkillCommandVariable_TD;
					DINEN61360:has_Instance_Description ?requiredCommand,
					?commandParameter.
				?requiredCommand DINEN61360:Expression_Goal "Requirement";
					DINEN61360:Value ?requiredCommandValue.
				?skillIri Cap:hasSkillCommand ?commandParameter.
				?commandParameter a Cap:SkillCommand;
					OpcUa:nodeId ?commandNodeId.
				# Exclude the commands, just get the other "normal" parameters
				OPTIONAL {
					?skillIri Cap:hasSkillParameter ?parameterIri.
					?parameterIri a Cap:SkillParameter;
					Cap:hasVariableName ?parameterName;
					Cap:hasVariableType ?parameterType;
					Cap:isRequired ?parameterRequired;
					OpcUa:nodeId ?parameterNodeId;
					FILTER NOT EXISTS {
						?parameterIri a Cap:SkillCommand.
					}
				}
		}`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, opcUaVariableSkillMapping).getFirstRootElement()[0] as OpcUaVariableSkill;

        // const opcUaSkillDescription = new OpcUaSkillMethod(skillIri, commandTypeIri, mappedResult);
        return mappedResult;
    }


}


// // TODO: Align with SkillParameter, fix this mess
class OpcUaVariableSkill {
    endpointUrl: string;
    messageSecurityMode: string;
    securityPolicy: string;
    userName: string;
    password: string;
    requiredCommandValue: number;
    commandNodeId: string;
    parameters: OpcUaSkillParameter[];
}

// class OpcUaSkillParameterResult {
//     endpointUrl: string;
//     messageSecurityMode: string;
//     securityPolicy: string;
//     username: string;
//     password: string;
//     parameters: OpcUaSkillParameter[];
// }


// class OpcUaVariableSkill {
//     private skillQueryResult: OpcUaSkillQueryResult;

//     constructor(public skillIri: string, public commandTypeIri: string, skillQueryResult: OpcUaSkillQueryResult) {
//         this.skillQueryResult = skillQueryResult;
//     }

//     get skillNodeId(): string { return this.skillQueryResult.skillNodeId;}
//     get endpointUrl(): string { return this.skillQueryResult.endpointUrl;}
//     get methodNodeId(): string { return this.skillQueryResult.methodNodeId;}
//     get messageSecurityMode(): string { return this.skillQueryResult.messageSecurityMode;}
//     get securityPolicy():string { return this.skillQueryResult.securityPolicy;}
//     get username(): string { return this.skillQueryResult.username;}
//     get password(): string { return this.skillQueryResult.password;}
//     get parameters(): any[] { return this.skillQueryResult.parameters;}
// }



