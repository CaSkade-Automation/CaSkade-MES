import { Injectable } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import { SocketGateway } from '../../socket-gateway/socket.gateway';
import { v4 as uuidv4 } from 'uuid';

import {ProductionModule, ProductionModuleDto} from "@shared/models/production-module/ProductionModule";
import { moduleMapping } from './module-mappings';

import {SparqlResultConverter} from 'sparql-result-converter';
import { CapabilityService } from '../capabilities/capability.service';
import { SkillService } from '../skills/skill.service';
const converter = new SparqlResultConverter();

@Injectable()
export class ModuleService {
    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private capabilityService: CapabilityService,
        private skillService: SkillService,
        private socketService: SocketGateway) {}

    /**
     * Register a new module
     * @param newModule Content of an RDF document
     */
    async addModule(newModule: string): Promise<string> {
        // create a graph name (uuid)
        const graphName = uuidv4();
        try {
            const dbResult = await this.graphDbConnection.addRdfDocument(newModule, graphName);
            if(dbResult) {
                // TODO: Check for errors from graphdb (e.g. syntax error while inserting)
                this.socketService.emitEvent('new-production-module');
                return 'mfgModule successfully registered';
            }
        } catch (error) {
            throw new Error(`Error while registering new production module. Error: ${error}`);
        }
    }

    /**
     * Get all modules including capabilities and skills. Returns a complete module representation
     */
    async getAllModulesWithCapabilitiesAndSkills(): Promise<ProductionModuleDto[]> {
        const productionModuleDtos = await this.getModules();

        for (const moduleDto of productionModuleDtos) {
            const moduleCapabilityDtos = await this.capabilityService.getCapabilitiesOfModule(moduleDto.iri);
            moduleDto.capabilityDtos = moduleCapabilityDtos;

            for (const capabilityDto of moduleDto.capabilityDtos) {
                const skillDtos = await this.skillService.getSkillsOfCapability(capabilityDto.iri);
                capabilityDto.skillDtos = skillDtos;
            }
        }

        return productionModuleDtos;
    }


    /**
     * Get a module with a given IRI
     * @param moduleIri IRI of the module to get
     */
    async getModuleByIri(moduleIri: string): Promise<ProductionModuleDto> {
        // just get the one result that should be returned for a given IRI
        const moduleDto = (await this.getModules(moduleIri))[0];

        // add capabilies
        const moduleCapabilityDtos = await this.capabilityService.getCapabilitiesOfModule(moduleDto.iri);
        moduleDto.capabilityDtos = moduleCapabilityDtos;

        // add skills for each capability
        for (const capabilityDto of moduleDto.capabilityDtos) {
            const skillDtos = await this.skillService.getSkillsOfCapability(capabilityDto.iri);
            capabilityDto.skillDtos = skillDtos;
        }

        return moduleDto;
    }



    /**
     * Get all modules without their capabilities and skills. Returns just the modules with their components and interfaces
     */
    private async getModules(moduleIri?: string): Promise<Array<ProductionModuleDto>> {
        let filterClause = "";
        if (moduleIri) {
            filterClause = `FILTER(?module = <${encodeURI(moduleIri)}>)`;
        }

        try {
            const query = `
                PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
                PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
                SELECT ?module ?component ?interface WHERE {
                    ?module a VDI3682:TechnicalResource.
                    OPTIONAL{
                        ?module VDI2206:consistsOf ?component.
                    }
                    OPTIONAL{
                        ?module VDI2206:hasInterface ?interface.
                    }
                    ${filterClause}
                }`;
            console.log(query);
            const queryResult = await this.graphDbConnection.executeQuery(query);
            const productionModules = converter.convert(queryResult.results.bindings, moduleMapping) as Array<ProductionModuleDto>;
            return productionModules;
        } catch (error) {
            console.error(`Error while returning all mfgModules, ${error}`);
            throw new Error(error);
        }
    }


    /**
     * Delete a module with a given IRI
     * @param moduleIri IRI of the module to delete
     */
    async deleteModule(moduleIri: string): Promise<string> {
        try {
            // Get module's graph
            // TODO: This could be moved into a separate graph model
            // TODO: Make sure descriptions of executable skills get deleted as well
            const graphQueryResults = await this.graphDbConnection.executeQuery(`
            PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
            SELECT ?s ?g WHERE {
                GRAPH ?g {
                    BIND(IRI("${moduleIri}") AS ?s).
                    {
                    ?s a VDI3682:TechnicalResource.
                    } UNION {
                    ?s VDI3682:TechnicalResourceIsAssignedToProcessOperator ?x.
                    }
                }
            }`);

            const resultBindings = graphQueryResults.results.bindings;
            resultBindings.forEach(binding => {
                const graphName = binding.g.value;
                this.graphDbConnection.clearGraph(graphName); // clear graph
            });
            return `Successfully deleted module with IRI ${moduleIri}`;
        } catch (error) {
            throw new Error(`Error while deleting module with IRI ${moduleIri}. Error: ${error}`);
        }
    }
}
