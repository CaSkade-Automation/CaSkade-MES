import { Injectable, BadRequestException } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import { v4 as uuidv4 } from 'uuid';

import { ProductionModuleDto } from "@shared/models/production-module/ProductionModule";
import { moduleMapping } from './module-mappings';

import {SparqlResultConverter} from 'sparql-result-converter';
import { SkillService } from '../skills/skill.service';
import { ModuleSocket } from '../../socket-gateway/module-socket';
import { SocketMessageType } from '@shared/socket-communication/SocketData';
const converter = new SparqlResultConverter();

@Injectable()
export class ModuleService {
    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private skillService: SkillService,
        private moduleSocket: ModuleSocket) {}

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
                this.moduleSocket.sendMessage(SocketMessageType.Added);
                // this.moduleSocket.doSomething();
                return 'ProductionModule successfully registered';
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
            const productionModules = converter.convertToDefinition(queryResult.results.bindings, moduleMapping).getFirstRootElement() as Array<ProductionModuleDto>;
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
            PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

            SELECT * WHERE {
                # Get the type with which the module was registered
                # This has to be made before getting the graph because inferred facts are not stored in any graph and lead to problems
                BIND(IRI(<${moduleIri}>) AS ?module)
                ?module a ?type.
                ?type sesame:directSubClassOf VDI3682:TechnicalResource.
                ?module ?prop ?skill.
                ?skill a Cap:Skill.
                ?prop sesame:directSubPropertyOf Cap:providesSkill.

                # Finding the graph can now be done using explicit facts
                GRAPH ?g {
                    {
                        ?module a ?type.
                    }   UNION {
                        ?module ?prop ?skill.
                    }
                }
            }`);

            const resultBindings = graphQueryResults.results.bindings;
            for (const binding of resultBindings) {
                const graphName = binding.g.value;
                await this.graphDbConnection.clearGraph(graphName); // clear graph
            }
            return `Successfully deleted module with IRI ${moduleIri}`;
        } catch (error) {
            throw new Error(`Error while deleting module with IRI ${moduleIri}. Error: ${error}`);
        }
    }
}
