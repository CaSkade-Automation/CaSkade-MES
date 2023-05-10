import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { GraphDbConnectionService } from '../../../../util/GraphDbConnection.service';
import { SparqlResultConverter } from 'sparql-result-converter';
import { opcUaVariableSkillMapping, opcUaVariableSkillOutputMapping } from '../skill-execution-mappings';
import { AttributeIds, ClientSubscription, ReadValueId} from 'node-opcua';
import { InternalServerErrorException } from '@nestjs/common';
import { SkillService } from '../../../skills/skill.service';
import { OpcUaSkillExecutor, OpcUaSkillParameter } from './OpcUaSkillExecutor';
import { SkillVariableDto } from '@shared/models/skill/SkillVariable';
import { OpcUaSessionManager } from '../../../../util/OpcUaSessionManager';
import { OpcUaStateTrackerManager } from '../../../../util/opcua-statetracker-manager.service';

/**
 * Skill executor for a skill whose transitions are fired by setting a command variable to a certain value
 */
export class OpcUaVariableSkillExecutionService extends OpcUaSkillExecutor{

    private skillService: SkillService;
    private uaStateTrackerManager: OpcUaStateTrackerManager;

    constructor(
        graphDbConnection: GraphDbConnectionService,
        skillService: SkillService,
        uaSessionManager: OpcUaSessionManager,
        uaStateTrackerManager: OpcUaStateTrackerManager
    ) {
        super(graphDbConnection, uaSessionManager);
        this.graphDbConnection = graphDbConnection;
        this.skillService = skillService;
        this.uaStateTrackerManager = uaStateTrackerManager;
        this.converter = new SparqlResultConverter();
    }


    /**
     * Invoke a transition by setting a command variable to a certain, required value
     * @param executionRequest Object containing skillIri, transitionIri and all parameters with the values they have to be set to
     */
    async invokeTransition(executionRequest: SkillExecutionRequestDto): Promise<any> {
        const uaSession = await this.sessionManager.getSession(executionRequest.skillIri);
        uaSession.readNamespaceArray();
        const skillDescription = await this.getOpcUaVariableSkillDescription(executionRequest.skillIri, executionRequest.commandTypeIri);
        const {parameters, commandNodeId, requiredCommandValue, commandNamespace} = skillDescription;

        try {
            // Write all "normal" parameters first
            for (const param of parameters) {
                const matchedReqParam = executionRequest.parameters.find(reqParam => reqParam.name == param.parameterName);
                if(matchedReqParam && matchedReqParam.value) {
                    await this.writeSingleNode(executionRequest.skillIri, param.parameterNodeId, matchedReqParam.value);
                }
            }
            // Then write the command parameter
            // Specifically for OpcUaVariableSkills: This type of skills doesn't send feedback about state changes, has to be actively tracked here
            await this.uaStateTrackerManager.getStateTracker(executionRequest.skillIri);

            console.log("writing command");
            console.log(executionRequest.commandTypeIri);

            console.log(commandNodeId, Number(requiredCommandValue), commandNamespace);

            await this.writeSingleNode(executionRequest.skillIri, commandNodeId, Number(requiredCommandValue), commandNamespace);


        } catch (err) {
            console.log(`Error while invoking transition "${executionRequest.commandTypeIri}" on skill "${executionRequest.skillIri}":`);
            console.log(err);
            throw new InternalServerErrorException(err);
        } finally {
            // this.endUaConnection();
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
        const uaSession = await this.sessionManager.getSession(executionRequest.skillIri);

        // Read all output nodes and match it with the existing output description of the skill
        for (const output of skillOutputDescription.outputs) {
            const readNode = new ReadValueId({
                nodeId: output.outputNodeId,
                attributeId: AttributeIds.Value
            });
            // Read the value. Note that OPC UA hides the result inside value.value. Result contains another value -> Thus 3 x value
            const outputValue = (await uaSession.read(readNode)).value.value.value;

            const matchingOutput = outputDtos.find(outputDto => outputDto.name == output.outputName);
            matchingOutput.value = outputValue;
        }

        return outputDtos;
    }


    async getOpcUaVariableSkillDescription(skillIri: string, commandTypeIri: string): Promise<OpcUaVariableSkill> {
        const query = `
		PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
        PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
        PREFIX CaSkMan: <http://www.w3id.org/hsu-aut/caskman#>
		PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
		PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>#
		PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
		SELECT ?skillIri ?endpointUrl ?messageSecurityMode ?securityPolicy ?requiredCommandValue ?commandNodeId ?commandNamespace
        ?parameterIri ?parameterRequired ?parameterName ?parameterType ?parameterNodeId WHERE {
			BIND(<${skillIri}> AS ?skillIri).
			?skillIri CSS:behaviorConformsTo/ISA88:hasTransition ?command;
                CSS:accessibleThrough ?skillInterface.
            ?skillInterface a CaSkMan:OpcUaVariableSkillInterface.
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
            ?commandVariableDataElement DINEN61360:has_Type_Description CaSk:SkillCommandVariable_TD;
                DINEN61360:has_Instance_Description ?requiredCommand,
                ?commandParameter.
            ?requiredCommand DINEN61360:Expression_Goal "Requirement";
                DINEN61360:Value ?requiredCommandValue.
            ?skillIri CaSk:hasSkillCommand ?commandParameter.
            ?commandParameter a CaSk:SkillCommand;
                OpcUa:nodeId ?commandNodeId.
            OPTIONAL {
                ?commandParameter OpcUa:nodeNamespace ?commandNamespace.
            }
            # Find parameters, exclude the commands, just get the other "normal" parameters
            OPTIONAL {
                ?skillIri CSS:hasParameter ?parameterIri.
                ?parameterIri a CSS:SkillParameter;
                CaSk:hasVariableName ?parameterName;
                CaSk:hasVariableType ?parameterType;
                CaSk:isRequired ?parameterRequired;
                OpcUa:nodeId ?parameterNodeId;
                FILTER NOT EXISTS {
                    ?parameterIri a CaSk:SkillCommand.
                }
            }
		}`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, opcUaVariableSkillMapping)
            .getFirstRootElement()[0] as OpcUaVariableSkill;

        return mappedResult;
    }


    /**
     * In order to get the outputs of an OpcUaVariableSkill, we have to read the nodes that are marked as outputs
     * @param skillIri
     * @returns
     */
    async getOpcUaSkillOutputDescription(skillIri: string): Promise<OpcUaVariableSkillOutput> {
        const query = `
		PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
        PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
        PREFIX CaSkMan: <http://www.w3id.org/hsu-aut/caskman#>
		PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
		SELECT ?skillIri ?endpointUrl ?messageSecurityMode ?securityPolicy ?userName ?password ?outputIri ?outputName ?outputNodeId WHERE {
			BIND(<${skillIri}> AS ?skillIri).
            ?skillIri CSS:accessibleThrough ?skillInterface.
            ?skillInterface a CaSkMan:OpcUaVariableSkillInterface.
            ?uaServer OpcUa:hasNodeSet/OpcUa:containsNode ?commandParameter;
                OpcUa:hasEndpointUrl ?endpointUrl;
                OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                OpcUa:hasSecurityPolicy ?securityPolicy.
            OPTIONAL {
                ?uaServer OpcUa:requiresUserName ?userName;
                OpcUa:requiresPassword ?password
            }

            ?skillIri CaSk:hasSkillOutput ?outputIri.
            ?outputIri CaSk:hasVariableName ?outputName;
                OpcUa:nodeId ?outputNodeId.

            # Filter out the current state outputs, we just want the return values here
            FILTER NOT EXISTS {
				?outputIri a CaSk:CurrentStateOutput.
            }
		}`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = this.converter.convertToDefinition(queryResult.results.bindings, opcUaVariableSkillOutputMapping)
            .getFirstRootElement()[0] as OpcUaVariableSkillOutput;

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

