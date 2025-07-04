import { Injectable, BadRequestException } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import * as crypto from 'crypto';
import { ProductionModuleDto } from "@shared/models/production-module/ProductionModule";
import { moduleMapping } from './module-mappings';

import {SparqlResultConverter} from 'sparql-result-converter';
import { ModuleSocket } from '../../socket-gateway/module-socket';
import { BaseSocketMessageType } from '@shared/models/socket-communication/SocketData';
import { CapabilityService } from '../capabilities/capability.service';
import { SkillService } from '../skills/skill.service';

const converter = new SparqlResultConverter();

@Injectable()
export class ModuleService {
    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private capabilityService: CapabilityService,
        private skillService: SkillService,
        private moduleSocket: ModuleSocket) {}

    /**
     * Register a new module
     * @param newModule Content of an RDF document
     */
    async addModule(newModule: string, contentType: string): Promise<void> {
        const modulesBefore = await this.getModules();

        // create a graph name for the module (uuid)
        const graphName = crypto.randomUUID();
        try {
            await this.graphDbConnection.addRdfDocument(newModule, graphName, contentType);
            const modulesAfter = await this.getModules();

            const newModules = modulesAfter.filter(
                moduleAfter => !modulesBefore.some(moduleBefore => moduleBefore.iri === moduleAfter.iri));

            this.moduleSocket.sendModulesAdded(newModules);
            return;
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
        const graphs = new Set<string>();
        // Deleting is done by removing the corresponding graph. Get all graphs from all capabilities and skills as well as the module itself and clear them
        const capabilityIris = (await this.capabilityService.getCapabilitiesOfModule(moduleIri)).map(cap => cap.iri);
        for (const capIri of capabilityIris) {
            const capabilityGraphs = await this.capabilityService.getGraphsOfCapability(capIri);
            capabilityGraphs.forEach(capabilityGraph => graphs.add(capabilityGraph));
        }

        const skillIris = (await this.skillService.getSkillsOfModule(moduleIri)).map(skill => skill.skillIri);
        for (const skillIri of skillIris) {
            const skillGraphs = await this.skillService.getGraphsOfSkill(skillIri);
            skillGraphs.forEach(skillGraph => graphs.add(skillGraph));
        }

        const moduleGraphs = await this.getGraphsOfModule(moduleIri);
        moduleGraphs.forEach(moduleGraph => graphs.add(moduleGraph));

        const deleteRequests = new Array<Promise<void>>();
        graphs.forEach(graph =>{
            deleteRequests.push(this.graphDbConnection.clearGraph(graph));
        });
        await Promise.all(deleteRequests);
        const modulesAfterDeleting = await this.getModules();

        this.moduleSocket.sendModuleDeleted(modulesAfterDeleting);
    }


    /**
     * Returns the graph(s) that a module is declared in
     * @param moduleIri IRI of a module to get graphs for
     * @returns Array of all graphs - typically only one entry
     */
    public async getGraphsOfModule(moduleIri: string): Promise<Array<string>> {
        const moduleStatement = `<${moduleIri}> a ?moduleClass.
            VALUES ?moduleClass {CSS:Resource  VDI3682:TechnicalResource VDI2206:Module VDI2206:System} .`;
        const graphs = await this.graphDbConnection.getGraphsContainingStatements(moduleStatement);
        return graphs;
    }
}
