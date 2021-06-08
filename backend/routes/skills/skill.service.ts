import { Injectable, BadRequestException } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';

import { SkillDto, SkillQueryResult} from "@shared/models/skill/Skill";
import { skillMapping } from './skill-mappings';
import { v4 as uuidv4 } from 'uuid';
import { SocketGateway } from '../../socket-gateway/socket.gateway';

import {SparqlResultConverter} from 'sparql-result-converter';
import { CapabilityService } from '../capabilities/capability.service';
import { SocketEventName } from '@shared/socket-communication/SocketEventName';
import { parameterQueryFragment, outputQueryFragment } from './query-fragments';
const converter = new SparqlResultConverter();

@Injectable()
export class SkillService {
    constructor(private graphDbConnection: GraphDbConnectionService,
        private socketGateway: SocketGateway,
        private capabilityService: CapabilityService){}


    /**
     * Register a new skill
     * @param newSkill Content of an RDF document describing a skill
     */
    async addSkill(newSkill: string): Promise<string> {
        try {
            // create a graph name for the skill (uuid)
            const skillGraphName = uuidv4();
            console.log("Adding Skill");

            await this.graphDbConnection.addRdfDocument(newSkill, skillGraphName);
            this.socketGateway.emitEvent(SocketEventName.Skills_Added);
            return 'New skill successfully added';
        } catch (error) {
            throw new BadRequestException(`Error while registering a new skill. Error: ${error.toString()}`);
        }
    }


    /**
     * Gets all skills that are currently registered
     */
    async getAllSkills(): Promise<Array<SkillDto>> {
        try {
            const query = `
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
            PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
            SELECT ?skill ?stateMachine ?currentStateTypeIri
                ?parameterIri ?parameterName ?parameterType ?parameterRequired ?parameterDefault ?paramOptionValue
                ?outputIri ?outputName ?outputType ?outputRequired ?outputDefault ?outputOptionValue
            WHERE {
                ?skill a Cap:Skill.
                ?skill Cap:hasStateMachine ?stateMachine.
                OPTIONAL {
                    ?skill Cap:hasCurrentState ?currentState.
                    ?currentState rdf:type ?currentStateTypeIri.
                    ?currentStateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
                }
                ${parameterQueryFragment}
                ${outputQueryFragment}
            }`;
            const queryResult = await this.graphDbConnection.executeQuery(query);
            const mappedResults = converter.convertToDefinition(queryResult.results.bindings, skillMapping, false).getFirstRootElement() as SkillQueryResult[];
            const skillDtos = mappedResults.map(result => new SkillDto(result));

            for (const skillDto of skillDtos) {
                const capabilityDtos = await this.capabilityService.getCapabilitiesOfSkill(skillDto.skillIri);
                skillDto.capabilityDtos = capabilityDtos;
            }

            return skillDtos;
        } catch(error) {
            throw new Error(`Error while returning all skills. Error: ${error}`);
        }
    }

    /**
     * Get a specific skill by its IRI
     * @param skillIri IRI of the skill to get
     */
    async getSkillByIri(skillIri: string): Promise<SkillDto> {
        try {
            const query = `
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
            PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
            SELECT ?skill ?stateMachine ?currentStateTypeIri
                ?parameterIri ?parameterName ?parameterType ?parameterRequired ?parameterDefault ?paramOptionValue
                ?outputIri ?outputName ?outputType ?outputRequired ?outputDefault ?outputOptionValue
            WHERE {
                ?skill a Cap:Skill.
                FILTER(?skill = IRI("${skillIri}"))
                ?skill Cap:hasStateMachine ?stateMachine.
                OPTIONAL {
                    ?skill Cap:hasCurrentState ?currentState.
                    ?currentState rdf:type ?currentStateTypeIri.
                    ?currentStateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
                }
                ${parameterQueryFragment}
                ${outputQueryFragment}
            }`;

            const rawResults = await this.graphDbConnection.executeQuery(query);
            const mappedResult = converter.convertToDefinition(rawResults.results.bindings, skillMapping, false).getFirstRootElement()[0] as SkillQueryResult;
            const skillDto = new SkillDto(mappedResult);

            const capabilityDtos = await this.capabilityService.getCapabilitiesOfSkill(skillDto.skillIri);
            skillDto.capabilityDtos = capabilityDtos;

            return skillDto;
        } catch(error) {
            throw new Error(`Error while returning skill with IRI ${skillIri}. Error: ${error}`);
        }
    }

    async getSkillsOfModule(moduleIri: string): Promise<SkillDto[]> {
        try {
            const query = `
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
            PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
            SELECT ?skill ?stateMachine ?currentStateTypeIri
                ?parameterIri ?parameterName ?parameterType ?parameterRequired ?parameterDefault ?paramOptionValue
                ?outputIri ?outputName ?outputType ?outputRequired ?outputDefault ?outputOptionValue
            WHERE {
                <${moduleIri}> Cap:providesSkill ?skill.
                ?skill Cap:hasStateMachine ?stateMachine.
                OPTIONAL {
                    ?skill Cap:hasCurrentState ?currentState.
                    ?currentState rdf:type ?currentStateTypeIri.
                    ?currentStateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
                }
                ${parameterQueryFragment}
                ${outputQueryFragment}
            }`;
            const rawResults = await this.graphDbConnection.executeQuery(query);
            const mappedResults = converter.convertToDefinition(rawResults.results.bindings, skillMapping, false).getFirstRootElement() as SkillQueryResult[];
            const skillDtos = mappedResults.map(result => new SkillDto(result));

            for (const skillDto of skillDtos) {
                const capabilityDtos = await this.capabilityService.getCapabilitiesOfSkill(skillDto.skillIri);
                skillDto.capabilityDtos = capabilityDtos;
            }

            return skillDtos;
        } catch(error) {
            throw new Error(`Error while returning skills of module ${moduleIri}. Error: ${error}`);
        }
    }

    async getSkillsForCapability(capabilityIri: string): Promise<SkillDto[]> {
        try {
            const query = `
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
            PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
            SELECT ?skill ?stateMachine ?currentStateTypeIri
                ?parameterIri ?parameterName ?parameterType ?parameterRequired ?parameterDefault ?paramOptionValue
                ?outputIri ?outputName ?outputType ?outputRequired ?outputDefault ?outputOptionValue
                WHERE {
                <${capabilityIri}> Cap:isExecutableVia ?skill.
                ?skill Cap:hasStateMachine ?stateMachine.
                OPTIONAL {
                    ?skill Cap:hasCurrentState ?currentState.
                    ?currentState rdf:type ?currentStateTypeIri.
                    ?currentStateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
                }
                OPTIONAL {
                    ?skill Cap:hasSkillParameter ?parameter.
                }
                ${parameterQueryFragment}
                ${outputQueryFragment}
            }`;
            const rawResults = await this.graphDbConnection.executeQuery(query);
            const skillResults = converter.convertToDefinition(rawResults.results.bindings, skillMapping, false).getFirstRootElement() as SkillQueryResult[];
            const skillDtos = skillResults.map(result => new SkillDto(result));

            for (const skillDto of skillDtos) {
                const capabilityDtos = await this.capabilityService.getCapabilitiesOfSkill(skillDto.skillIri);
                skillDto.capabilityDtos = capabilityDtos;
            }

            return skillDtos;
        } catch(error) {
            throw new Error(`Error while returning all skills that are suited for capability ${capabilityIri}. Error: ${error}`);
        }
    }

    /**
     * Delete a skill with a given IRI
     * @param skillIri IRI of the skill to delete
     */
    async deleteSkill(skillIri: string): Promise<string> {
        try {
            const query = `
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            SELECT ?skill ?graph WHERE {
                BIND(<${skillIri}> AS ?skill)
                ?skill a ?skillType.
                ?type rdfs:subClassOf Cap:Skill.
                GRAPH ?graph {
                    ?skill a ?skillType
                    }
                }`;

            const queryResult = await this.graphDbConnection.executeQuery(query);
            const queryResultBindings = queryResult.results.bindings;

            if (queryResultBindings.length == 0) {
                throw new Error(`No graph could be found. Deleting skill ${skillIri} failed.`);
            }

            // iterate over graphs and clear every one
            queryResultBindings.forEach(bindings => {
                const graphName = bindings.graph.value;
                this.graphDbConnection.clearGraph(graphName);
            });
            this.socketGateway.emitEvent(SocketEventName.Skills_Deleted, `Sucessfully deleted skill with IRI ${skillIri}}`);
            return `{message: Sucessfully deleted skill with IRI ${skillIri}}`;
        } catch (error) {
            throw new Error(
                `Error while trying to delete skill with IRI ${skillIri}. Error: ${error}`
            );
        }
    }

    async updateState(skillIri:string, newStateTypeIri: string): Promise<string> {
        try {
            const deleteQuery = `
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            DELETE WHERE {
                <${skillIri}> Cap:hasCurrentState ?oldCurrentState.
            }`;
            await this.graphDbConnection.executeUpdate(deleteQuery);

            const insertQuery = `
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            INSERT {
                <${skillIri}> Cap:hasCurrentState ?newState.
            } WHERE {
                ?newState a <${newStateTypeIri}>.
            }`;
            const queryResult = await this.graphDbConnection.executeUpdate(insertQuery);
            this.socketGateway.emitEvent(SocketEventName.Skills_StateChanged, {skillIri: skillIri, newStateTypeIri: newStateTypeIri});
            return `Sucessfully updated currentState of skill ${skillIri}`;
        } catch (error) {
            throw new Error(
                `Error while trying to update currentState of skill: ${skillIri}. Error: ${error}`
            );
        }
    }
}
