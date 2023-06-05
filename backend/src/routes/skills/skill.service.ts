import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import * as crypto from 'crypto';
import { SkillDto, SkillQueryResult} from "@shared/models/skill/Skill";
import { skillMapping } from './skill-mappings';
import { SkillSocket } from '../../socket-gateway/skill-socket';

import {SparqlResultConverter} from 'sparql-result-converter';
import { parameterQueryFragment, outputQueryFragment, skillTypeFragment, skillInterfaceTypeFragment } from './query-fragments';
import { OpcUaVariableSkillExecutionService } from '../skill-execution/executors/opc-ua-executors/OpcUaVariableSkillExecutor';
import { BaseSocketMessageType } from '@shared/models/socket-communication/SocketData';
import { CapabilitySocket } from '../../socket-gateway/capability-socket';
import { CapabilityService } from '../capabilities/capability.service';
import { OpcUaSessionManager } from '../../util/OpcUaSessionManager';
import { OpcUaStateTrackerManager } from '../../util/opcua-statetracker-manager.service';
const converter = new SparqlResultConverter();

@Injectable()
export class SkillService {
    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private skillSocket: SkillSocket,
        private capabilitySocket: CapabilitySocket,
        private uaStateTrackerManager: OpcUaStateTrackerManager,
        @Inject(forwardRef(() => CapabilityService))
        private capabilityService: CapabilityService,
    ) {}


    /**
     * Register one or more skills described in an RDF document
     * @param newSkill Content of an RDF document describing a skill
     */
    async addSkills(newSkill: string, contentType?: string): Promise<string> {
        const skillsBefore = await this.getAllSkills();
        try {
            // create a graph name for the skill (uuid)
            // TODO: There is a problem with multiple skills: Only one graphName is created leading to problems on delete
            const skillGraphName = crypto.randomUUID();
            await this.graphDbConnection.addRdfDocument(newSkill, skillGraphName, contentType);

            const skillsAfter = await this.getAllSkills();

            const newSkills = skillsAfter.filter(
                skillAfter => !skillsBefore.some(skillBefore => skillBefore.skillIri === skillAfter.skillIri));

            // For all new skills, get their IRI and skill type to setup a state change monitor in case its an OpcUaVariableSkill
            for (const newSkill of newSkills) {
                if (newSkill.skillInterfaceType == "http://www.w3id.org/hsu-aut/caskman#OpcUaVariableSkillInterface") {
                    this.uaStateTrackerManager.getStateTracker(newSkill.skillIri);
                }

                // get the new capabilities and send a socket message that a capability was registered
                for (const capabilitIri of newSkill.capabilityIris) {
                    const capability = this.capabilityService.getCapabilityByIri(capabilitIri);
                    this.capabilitySocket.sendMessage(BaseSocketMessageType.Added, capability);
                }

                // Finally, send a socket message that the skill was registered
                this.skillSocket.sendMessage(BaseSocketMessageType.Added, skillsAfter);
            }

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
            PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
            PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
            PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
            PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
            SELECT ?skill ?skillType ?skillInterfaceType ?capability ?stateMachine ?currentStateTypeIri
                ?parameterIri ?parameterName ?parameterType ?parameterRequired ?parameterDefault ?paramOptionValue
                ?outputIri ?outputName ?outputType ?outputRequired ?outputDefault ?outputOptionValue
            WHERE {
                ?skill a CSS:Skill;
                    CSS:behaviorConformsTo ?stateMachine.
                ?capability CSS:isRealizedBy ?skill.
                OPTIONAL {
                    ?skill CaSk:hasCurrentState ?currentState.
                    ?currentState rdf:type ?currentStateTypeIri.
                    ?currentStateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
                }
                ${skillTypeFragment}
                ${skillInterfaceTypeFragment}
                ${parameterQueryFragment}
                ${outputQueryFragment}
            }`;
            const queryResult = await this.graphDbConnection.executeQuery(query);
            const mappedResults = converter.convertToDefinition(queryResult.results.bindings, skillMapping, false)
                .getFirstRootElement() as SkillQueryResult[];
            const skillDtos = mappedResults.map(result => new SkillDto(result));

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
            PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
            PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
            PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
            PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
            SELECT ?skill ?skillType ?skillInterfaceType ?capability ?stateMachine ?currentStateTypeIri
                ?parameterIri ?parameterName ?parameterType ?parameterRequired ?parameterDefault ?paramOptionValue
                ?outputIri ?outputName ?outputType ?outputRequired ?outputDefault ?outputOptionValue
            WHERE {
                ?skill a CSS:Skill;
                    CSS:behaviorConformsTo ?stateMachine.
                ?capability CSS:isRealizedBy ?skill.
                FILTER(?skill = IRI("${skillIri}"))
                OPTIONAL {
                    ?skill CaSk:hasCurrentState ?currentState.
                    ?currentState rdf:type ?currentStateTypeIri.
                    ?currentStateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
                }
                ${skillTypeFragment}
                ${skillInterfaceTypeFragment}
                ${parameterQueryFragment}
                ${outputQueryFragment}
            }`;

            const rawResults = await this.graphDbConnection.executeQuery(query);
            const mappedResult = converter.convertToDefinition(rawResults.results.bindings, skillMapping, false)
                .getFirstRootElement()[0] as SkillQueryResult;
            const skillDto = new SkillDto(mappedResult);

            return skillDto;
        } catch(error) {
            throw new Error(`Error while returning skill with IRI ${skillIri}. Error: ${error}`);
        }
    }

    async getSkillsOfModule(moduleIri: string): Promise<SkillDto[]> {
        try {
            const query = `
            PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
            PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
            PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
            PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
            SELECT ?skill ?skillType ?skillInterfaceType ?capability ?stateMachine ?currentStateTypeIri
                ?parameterIri ?parameterName ?parameterType ?parameterRequired ?parameterDefault ?paramOptionValue
                ?outputIri ?outputName ?outputType ?outputRequired ?outputDefault ?outputOptionValue
            WHERE {
                <${moduleIri}> CSS:providesSkill ?skill.
                ?capability CSS:isRealizedBy ?skill.
                ?skill CSS:behaviorConformsTo ?stateMachine.
                OPTIONAL {
                    ?skill CaSk:hasCurrentState ?currentState.
                    ?currentState rdf:type ?currentStateTypeIri.
                    ?currentStateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
                }
                ${skillTypeFragment}
                ${skillInterfaceTypeFragment}
                ${parameterQueryFragment}
                ${outputQueryFragment}
            }`;
            const rawResults = await this.graphDbConnection.executeQuery(query);
            const mappedResults = converter.convertToDefinition(rawResults.results.bindings, skillMapping, false)
                .getFirstRootElement() as SkillQueryResult[];
            const skillDtos = mappedResults.map(result => new SkillDto(result));

            return skillDtos;
        } catch(error) {
            throw new Error(`Error while returning skills of module ${moduleIri}. Error: ${error}`);
        }
    }

    async getSkillsForCapability(capabilityIri: string): Promise<SkillDto[]> {
        try {
            const query = `
            PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
            PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
            PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
            PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
            SELECT ?skill ?skillType ?skillInterfaceType ?capability ?stateMachine ?currentStateTypeIri
                ?parameterIri ?parameterName ?parameterType ?parameterRequired ?parameterDefault ?paramOptionValue
                ?outputIri ?outputName ?outputType ?outputRequired ?outputDefault ?outputOptionValue
                WHERE {
                    ?capability CSS:isRealizedBy ?skill.
                    FILTER(?capability = <${capabilityIri}>)
                    ?skill CSS:behaviorConformsTo ?stateMachine.
                    OPTIONAL {
                        ?skill CaSk:hasCurrentState ?currentState.
                        ?currentState rdf:type ?currentStateTypeIri.
                        ?currentStateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
                    }
                    ${skillTypeFragment}
                    ${skillInterfaceTypeFragment}
                    ${parameterQueryFragment}
                    ${outputQueryFragment}
            }`;
            const rawResults = await this.graphDbConnection.executeQuery(query);
            const skillResults = converter.convertToDefinition(rawResults.results.bindings, skillMapping, false)
                .getFirstRootElement() as SkillQueryResult[];
            const skillDtos = skillResults.map(result => new SkillDto(result));
            return skillDtos;
        } catch(error) {
            throw new Error(`Error while returning all skills that are suited for capability ${capabilityIri}. Error: ${error}`);
        }
    }

    async deleteSkillsOfCapability(capabilityIri: string): Promise<void> {
        const skills = await this.getSkillsForCapability(capabilityIri);
        skills.forEach(skill => {
            this.deleteSkill(skill.skillIri);
        });
    }


    /**
     * Delete a skill with a given IRI
     * @param skillIri IRI of the skill to delete
     */
    async deleteSkill(skillIri: string): Promise<void> {
        try {
            const query = `
            PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
            SELECT ?skill ?graph WHERE {
                BIND(<${skillIri}> AS ?skill)
                ?skill a ?skillType.
                ?type rdfs:subClassOf CSS:Skill.
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
            this.skillSocket.sendMessage(BaseSocketMessageType.Deleted, `Sucessfully deleted skill with IRI ${skillIri}}`);
        } catch (error) {
            throw new Error(
                `Error while trying to delete skill with IRI ${skillIri}. Error: ${error}`
            );
        }
    }


    /**
     * Returns the skill in the given graph. Can be used to get the latest skill
     */
    async getSkillInGraph(graphIri: string): Promise<{skillIri: string, skillInterfaceTypeIri: string}> {
        const query = `
        PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?skillIri ?skillInterfaceTypeIri ?g
        WHERE {
            ?skillInterfaceTypeIri rdfs:subClassOf CSS:SkillInterface.   # Get the explicit type that was used to register the skill
            ?skillIri CSS:accessibleThrough ?skillInterface.
            GRAPH ?g {
                ?skillInterface a ?skillInterfaceTypeIri.             # Get the graph where the skill was registered
            }
            FILTER (?g = <urn:${graphIri}>)         # Only get the skill inside the given graph
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const skillIri = queryResult.results.bindings[0]["skillIri"].value as string;
        const skillInterfaceTypeIri = queryResult.results.bindings[0]["skillInterfaceTypeIri"].value as string;
        return {skillIri, skillInterfaceTypeIri};
    }


    /**
     * Get the skill interface type of a given skill
     * @param skillIri IRI of the skill to get the interface type of
     */
    public async getSkillInterfaceType(skillIri: string): Promise<string> {
        const query = `
        PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
        PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
        PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
        SELECT ?skill ?skillInterfaceType WHERE {
            ${skillInterfaceTypeFragment}
            FILTER(?skill = IRI("${skillIri}"))     # Filter for this one specific skill
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const skillInterfaceType = queryResult.results.bindings[0]["skillInterfaceType"].value;
        return skillInterfaceType;
    }
}
