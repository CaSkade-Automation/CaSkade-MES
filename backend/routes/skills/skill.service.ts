import { Injectable } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';

import { SkillDto} from "@shared/models/skill/Skill";
import { skillMapping } from './skill-mappings';
import { v4 as uuidv4 } from 'uuid';
import { SocketGateway } from '../../socket-gateway/socket.gateway';

import {SparqlResultConverter} from 'sparql-result-converter';
import { CapabilityService } from '../capabilities/capability.service';
const converter = new SparqlResultConverter();

@Injectable()
export class SkillService {
    constructor(private graphDbConnection: GraphDbConnectionService,
        private socketGateway: SocketGateway,
        private capabilityService: CapabilityService) { }

    /**
     * Register a new skill
     * @param newSkill Content of an RDF document describing a skill
     */
    async addSkill(newSkill: string): Promise<string> {
        try {
            // create a graph name for the service (uuid)
            const skilGraphName = uuidv4();
            console.log("Adding Skill");

            this.graphDbConnection.addRdfDocument(newSkill, skilGraphName);
            this.socketGateway.emitEvent('new-skill');
            return 'New skill successfully added';
        } catch (error) {
            throw new Error(`Error while registering a new skill. Error: ${error}`);
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
            SELECT ?skill ?stateMachine ?currentStateTypeIri WHERE {
                ?skill a Cap:Skill.
                ?skill Cap:hasStateMachine ?stateMachine.
                OPTIONAL {
                    ?skill Cap:hasCurrentState ?currentState.
                    ?currentState rdf:type ?currentStateTypeIri.
                    ?currentStateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
                }
            }`;
            const queryResult = await this.graphDbConnection.executeQuery(query);
            const skillDtos = converter.convert(queryResult.results.bindings, skillMapping) as Array<SkillDto>;

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
            SELECT ?skill ?stateMachine ?currentStateTypeIri WHERE {
                ?skill a Cap:Skill.
                FILTER(?skill = IRI("${skillIri}"))
                ?skill Cap:hasStateMachine ?stateMachine.
                OPTIONAL {
                    ?skill Cap:hasCurrentState ?currentState.
                    ?currentState rdf:type ?currentStateTypeIri.
                    ?currentStateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
                }
            }`;

            const queryResult = await this.graphDbConnection.executeQuery(query);
            const skillDto = converter.convert(queryResult.results.bindings, skillMapping)[0] as SkillDto;

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
            SELECT ?skill ?stateMachine ?currentStateTypeIri WHERE {
                <${moduleIri}> Cap:hasSkill ?skill.
                ?skill Cap:hasStateMachine ?stateMachine.
                OPTIONAL {
                    ?skill Cap:hasCurrentState ?currentState.
                    ?currentState rdf:type ?currentStateTypeIri.
                    ?currentStateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
                }
            }`;
            const queryResult = await this.graphDbConnection.executeQuery(query);
            const skillDtos = converter.convert(queryResult.results.bindings, skillMapping) as SkillDto[];
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
            SELECT ?skill ?stateMachine ?currentStateTypeIri WHERE {
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
            }`;
            const queryResult = await this.graphDbConnection.executeQuery(query);
            const skillDtos = converter.convert(queryResult.results.bindings, skillMapping) as SkillDto[];

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
                GRAPH ?graph {
                    BIND(IRI("${skillIri}") AS ?skill).
                    ?skill a Cap:Skill.
                    }
                }
            }`;

            const queryResult = await this.graphDbConnection.executeQuery(query);
            const queryResultBindings = queryResult.results.bindings;

            // iterate over graphs and clear every one
            queryResultBindings.forEach(bindings => {
                const graphName = bindings.graph.value;
                this.graphDbConnection.clearGraph(graphName);
            });
            return `Sucessfully deleted skill with IRI ${skillIri}`;
        } catch (error) {
            throw new Error(
                `Error while trying to delete skill with IRI ${skillIri}. Error: ${error}`
            );
        }
    }
}
