import { Injectable, BadRequestException } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import { SocketGateway } from '../../socket-gateway/socket.gateway';
import { v4 as uuidv4 } from 'uuid';

import { ProductionModuleDto } from "@shared/models/production-module/ProductionModule";
import { moduleMapping } from './module-mappings';

import {SparqlResultConverter} from 'sparql-result-converter';
import { SkillService } from '../skills/skill.service';
import { SocketEventName } from '@shared/socket-communication/SocketEventName';
const converter = new SparqlResultConverter();

@Injectable()
export class ModuleService {
    constructor(
        private graphDbConnection: GraphDbConnectionService,
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
                this.socketService.emitEvent(SocketEventName.ProductionModules_Added);
                return 'mfgModule successfully registered';
            }
        } catch (error) {
            throw new BadRequestException(`Error while registering new production module. Error: ${error.toString()}`);
        }
    }

    /**
     * Get all modules including skills. Returns a complete module representation
     */
    async getAllModulesWithSkills(): Promise<ProductionModuleDto[]> {
        // get all modules "raw" (=)
        const productionModuleDtos = await this.getModules();

        for (const moduleDto of productionModuleDtos) {
            const moduleSkillDtos = await this.skillService.getSkillsOfModule(moduleDto.iri);
            moduleDto.skillDtos = moduleSkillDtos;
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

        // add skills
        const moduleSkillDtos = await this.skillService.getSkillsOfModule(moduleDto.iri);
        moduleDto.skillDtos = moduleSkillDtos;

        return moduleDto;
    }



    /**
     * Get all modules without their skills. Returns just the modules with their components and interfaces
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
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>

            SELECT ?module ?g WHERE {
                GRAPH ?g {
                    BIND(IRI("${moduleIri}") AS ?module).
                    {
                        ?module a ?type.
                    }   UNION {
                        ?module Cap:providesSkill ?skill.
                    }
                }
                VALUES ?type {VDI2206:Module VDI2206:System VDI3682:TechnicalResource}
            }`);

            console.log(graphQueryResults);

            const resultBindings = graphQueryResults.results.bindings;
            for (const binding of resultBindings) {
                const graphName = binding.g.value;
                console.log(graphName);
                await this.graphDbConnection.clearGraph(graphName); // clear graph
            }
            return `Successfully deleted module with IRI ${moduleIri}`;
        } catch (error) {
            throw new Error(`Error while deleting module with IRI ${moduleIri}. Error: ${error}`);
        }
    }
}
