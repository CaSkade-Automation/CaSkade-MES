import { Injectable } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import { SocketGateway } from '../../socket-gateway/socket.gateway';
import { v4 as uuidv4 } from 'uuid';

import {ProductionModule} from "@shared/models/production-module/ProductionModule";
import { moduleMapping } from './module-mappings';

import SparqlResultConverter = require('sparql-result-converter');  // strange syntax because SparqlConverter doesn't allow ES6-imports yet
import { CapabilityService } from '../capabilities/capability.service';
import { SkillService } from '../skills/skill.service';
import { Product } from '../../../shared/models/fpb/FpbElement';
import { Capability } from '../../../shared/models/capability/Capability';
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


    async getAllModulesComplete(): Promise<ProductionModule[]> {
        let modules = await this.getAllModules();

        for (const module of modules) {
            const moduleCapabilities = await this.capabilityService.getCapabilitiesOfModule(module.iri);
            module.addCapabilities(moduleCapabilities);
            console.log(module);


            for (const capability of module.capabilities) {
                const skills = await this.skillService.getSkillsOfCapability(capability.iri);
                capability.addSkills(skills);
            }
        }

        return modules;
    }

    /**
     * Get all modules that are currently registered
     */
    async getAllModules(): Promise<Array<ProductionModule>> {
        try {
            const queryResult = await this.graphDbConnection.executeQuery(`
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
      }`);
            let productionModules = converter.convert(queryResult.results.bindings, moduleMapping) as Array<ProductionModule>;
            productionModules = productionModules.map(module => new ProductionModule(module.iri, new Array<Capability>()));
            return productionModules;
        } catch (error) {
            console.error(`Error while returning all mfgModules, ${error}`);
            throw new Error(error);
        }
    }

    /**
     * Get a module with a given IRI
     * @param moduleIri IRI of the module to get
     */
    async getModuleByIri(moduleIri: string): Promise<ProductionModule> {
        try {
            const queryResult = await this.graphDbConnection.executeQuery(`
            PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
            SELECT ?module WHERE {
                ?module a VDI3682:TechnicalResource.
                FILTER(?module = IRI("${moduleIri}"))
            }`);
            const productionModule = converter.convert(queryResult.results.bindings, moduleMapping)[0] as ProductionModule;
            return productionModule;
        } catch (error) {
            console.error(`Error while returning module with IRI '${moduleIri}'`);
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
