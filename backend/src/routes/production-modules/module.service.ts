import { Injectable, BadRequestException } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import * as crypto from 'crypto';
import { ProductionModuleDto } from "@shared/models/production-module/ProductionModule";
import { moduleMapping } from './module-mappings';

import {SparqlResultConverter} from 'sparql-result-converter';
import { ModuleSocket } from '../../socket-gateway/module-socket';
import { BaseSocketMessageType } from '@shared/models/socket-communication/SocketData';
import { CapabilityService } from '../capabilities/capability.service';

const converter = new SparqlResultConverter();

@Injectable()
export class ModuleService {
    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private capabilityService: CapabilityService,
        private moduleSocket: ModuleSocket) {}

    /**
     * Register a new module
     * @param newModule Content of an RDF document
     */
    async addModule(newModule: string, contentType: string): Promise<Record<string, string>> {
        // create a graph name (uuid)
        const graphName = crypto.randomUUID();
        try {
            await this.graphDbConnection.addRdfDocument(newModule, graphName, contentType);
            const modulesAfter = await this.getModules();

            this.moduleSocket.sendMessage(BaseSocketMessageType.Added, modulesAfter);
            return {msg:'ProductionModule successfully registered'};
        } catch (error) {
            throw new BadRequestException(`Error while registering new production module. ${error.toString()}`);
        }
    }

    /**
     * Get all modules including skills. Returns a complete module representation
     */
    async getModules(moduleIri?: string): Promise<ProductionModuleDto[]> {
        // get all modules "raw" (=)
        const productionModuleDtos = await this.getModulesOnly(moduleIri);

        for (const moduleDto of productionModuleDtos) {
            const moduleCapabilityDtos = await this.capabilityService.getCapabilitiesOfModule(moduleDto.iri);
            moduleDto.capabilityDtos = moduleCapabilityDtos;
        }
        return productionModuleDtos;
    }


    /**
     * Get a module with a given IRI
     * @param moduleIri IRI of the module to get
     */
    async getModuleByIri(moduleIri: string): Promise<ProductionModuleDto> {
        // Note: This is just a wrapper around the "normal" module function that only returns a single result
        const modules = await this.getModules(moduleIri);
        return modules[0];
    }



    /**
     * Get all modules without their skills. Returns just the modules with their components and interfaces
     */
    private async getModulesOnly(moduleIri?: string): Promise<Array<ProductionModuleDto>> {
        let filterClause = "";
        if (moduleIri) {
            filterClause = `FILTER(?module = <${encodeURI(moduleIri)}>)`;
        }

        try {
            const query = `
                PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
                PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
                SELECT ?module ?component ?interface WHERE {
                    ?module a CSS:Resource.
                    OPTIONAL{
                        ?module VDI2206:consistsOf ?component.
                    }
                    OPTIONAL{
                        ?module VDI2206:hasInterface ?interface.
                    }
                    ${filterClause}
                }`;
            const queryResult = await this.graphDbConnection.executeQuery(query);
            const productionModules = converter.convertToDefinition(queryResult.results.bindings, moduleMapping)
                .getFirstRootElement() as Array<ProductionModuleDto>;
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
    async deleteModule(moduleIri: string): Promise<void> {
        try {
            // First, delete all capabilities of the module
            this.capabilityService.deleteCapabilitiesOfModule(moduleIri);
            // Get module's graph
            // TODO: This could be moved into a separate graph model
            // TODO: Make sure descriptions of executable skills get deleted as well
            const graphQueryResults = await this.graphDbConnection.executeQuery(`
            PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
            PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
            SELECT DISTINCT * WHERE {
                # Get the graph into which module was registered. Types have to be given as values so that explicit facts are retrieved
                # Inferred facts are not stored inside a named graph
                BIND(IRI(<${moduleIri}>) AS ?module)
                ?module a ?type.
                VALUES ?type {
                    CSS:Resource  VDI3682:TechnicalResource VDI2206:Module VDI2206:System
                }.
                # Finding the graph can now be done using explicit facts
                GRAPH ?g {
                    ?module a ?type.
                }
            }`);

            const resultBindings = graphQueryResults.results.bindings;
            const deleteRequests = new Array<Promise<{statusCode: any;msg: any;}>>();
            resultBindings.forEach(binding => {
                const graphName = binding.g.value;
                deleteRequests.push(this.graphDbConnection.clearGraph(graphName)); // clear graph
            });
            await Promise.all(deleteRequests);
            const modulesAfterDeleting = await this.getModules();
            console.log("after delete");

            console.log(modulesAfterDeleting);

            this.moduleSocket.sendMessage(BaseSocketMessageType.Deleted, modulesAfterDeleting);

        } catch (error) {
            throw new Error(`Error while deleting module with IRI ${moduleIri}. ${error}`);
        }
    }
}
