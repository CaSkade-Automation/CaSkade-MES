import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { GraphDbConnectionService } from '../../../../util/GraphDbConnection.service';
import { SparqlResultConverter } from 'sparql-result-converter';
import { opcUaVariableSkillMapping, opcUaVariableSkillOutputMapping } from '../skill-execution-mappings';
import { AttributeIds, ClientSubscription, ReadValueId} from 'node-opcua';
import { InternalServerErrorException } from '@nestjs/common';
import { SkillService } from '../../../skills/skill.service';
import { OpcUaSkillExecutor, OpcUaSkillParameter } from './OpcUaSkillExecutor';
import { SkillVariableDto } from '@shared/models/skill/SkillVariable';

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
        this.uaSession.readNamespaceArray();
        const skillDescription = await this.getOpcUaVariableSkillDescription(executionRequest.skillIri, executionRequest.commandTypeIri);

        try {
            // Write all "normal" parameters first
            for (const param of skillDescription.parameters) {
                const matchedReqParam = executionRequest.parameters.find(reqParam => reqParam.name == param.parameterName);
                if(matchedReqParam && matchedReqParam.value) {
                    await this.writeSingleNode(param.parameterNodeId, matchedReqParam.value);
                }
            }
            // Then write the command parameter
            await this.writeSingleNode(skillDescription.commandNodeId, Number(skillDescription.requiredCommandValue), skillDescription.commandNamespace);

            // Specifically for OpcUaVariableSkills: This type of skills doesn't send feedback about state changes, has to be actively tracked here
            ClientSubscription.create(this.uaSession, {});

        } catch (err) {
            console.log(`Error while invoking transition "${executionRequest.commandTypeIri}" on skill "${executionRequest.skillIri}":`);
            console.log(err);
            throw new InternalServerErrorException();
        } finally {
            this.endUaConnection();
        }
    }


    /**
     * Returns all outputs of the skill by reading the OPC UA nodes that are marked as skill outputs
     * @param executionRequest No
     */
    async getSkillOutputs(executionRequest?: SkillExecutionRequestDto): Promise<SkillVariableDto[]> {
        const skill = await this.skillService.getSkillByIri(executionRequest.skillIri);
        const outputDtos = skill.skillOutputsDtos;

        if (outputDtos == undefined || outputDtos.length == 0 ) return [];

        const skillOutputDescription = await this.getOpcUaSkillOutputDescription(executionRequest.skillIri);

        // Read all output nodes and match it with the existing output description of the skill
        for (const output of skillOutputDescription.outputs) {
            const readNode = new ReadValueId({
                nodeId: output.outputNodeId,
                attributeId: AttributeIds.Value
            });
            // Read the value. Note that OPC UA hides the result inside value.value. Result contains another value -> Thus 3 x value
            const outputValue = (await this.uaSession.read(readNode)).value.value.value;

            const matchingOutput = outputDtos.find(outputDto => outputDto.name == output.outputName);
            matchingOutput.value = outputValue;
        }

        return outputDtos;
    }


    async getOpcUaVariableSkillDescription(skillIri: string, commandTypeIri: string): Promise<OpcUaVariableSkill> {
        const query = `
		PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
		PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
		PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>#
		PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
		SELECT ?skillIri ?endpointUrl ?messageSecurityMode ?securityPolicy ?requiredCommandValue ?commandNodeId ?commandNamespace ?parameterIri
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
            OPTIONAL {
                ?commandParameter OpcUa:nodeNamespace ?commandNamespace.
            }
            # Find parameters, exclude the commands, just get the other "normal" parameters
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

        return mappedResult;
    }


    /**
     * In order to get the outputs of an OpcUaVariableSkill, we have to read the nodes that are marked as outputs
     * @param skillIri
     * @returns
     */
    async getOpcUaSkillOutputDescription(skillIri: string): Promise<OpcUaVariableSkillOutput> {
        const query = `
		PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
		PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
		SELECT ?skillIri ?endpointUrl ?messageSecurityMode ?securityPolicy ?userName ?password ?outputIri ?outputName ?outputNodeId WHERE {
			BIND(<${skillIri}> AS ?skillIri).
            ?skillIri a Cap:OpcUaVariableSkill.
            ?uaServer OpcUa:hasNodeSet/OpcUa:containsNode ?commandParameter;
                OpcUa:hasEndpointUrl ?endpointUrl;
                OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                OpcUa:hasSecurityPolicy ?securityPolicy.
            OPTIONAL {
                ?uaServer OpcUa:requiresUserName ?userName;
                OpcUa:requiresPassword ?password
            }

            ?skillIri Cap:hasSkillOutput ?outputIri.
            ?outputIri Cap:hasVariableName ?outputName;
                OpcUa:nodeId ?outputNodeId.

            # Filter out the current state outputs, we just want the return values here
            FILTER NOT EXISTS {
				?outputIri a Cap:CurrentStateOutput.
            }
		}`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = this.converter.convertToDefinition(queryResult.results.bindings, opcUaVariableSkillOutputMapping).getFirstRootElement()[0] as OpcUaVariableSkillOutput;

        return mappedResult;
    }


}

class OpcUaVariableSkill {
    endpointUrl: string;
    messageSecurityMode: string;
    securityPolicy: string;
    userName: string;
    password: string;
    requiredCommandValue: number;
    commandNodeId: string;
    commandNamespace: string;
    parameters: OpcUaSkillParameter[];
}

/**
 * All relevant info to read an output node
 */
class OpcUaVariableSkillOutput {
    endpointUrl: string;
    messageSecurityMode: string;
    securityPolicy: string;
    userName: string;
    password: string;
    outputs: OpcUaVariableSkillOutputNode[];
}

class OpcUaVariableSkillOutputNode {
    outputIri: string;
    outputName: string;
    outputNodeId: string;
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



