import { Injectable } from "@nestjs/common";
import { GraphDbConnectionService } from "util/GraphDbConnection.service";
import { SocketGateway } from "socket-gateway/socket.gateway";
import { v4 as uuidv4 } from 'uuid';

import { moduleMapping } from './module-mappings';

const SparqlResultConverter = require('sparql-result-converter');
const converter = new SparqlResultConverter();

@Injectable()
export class ModuleService {

  constructor(
    private graphDbConnection: GraphDbConnectionService,
    private socketService: SocketGateway) { }


  addModule(newModuleDocument: string) {
    // create a graph name (uuid)
    const graphName = uuidv4();

    this.graphDbConnection.addRdfDocument(newModuleDocument, graphName)
      .then((dbResult) => {
        // TODO: Check for errors from graphdb (e.g. syntax error while inserting)
        this.socketService.emitModuleRegistrationEvent("newmfgModule");
        return "mfgModule successfully registered";
      })
      .catch((err) => {
        return (
          {
            "msg": "Error while registering a new mfgModule",
            "err": err,
          }
        );
      })
  };


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
      }`
      )
      const productionModules = converter.convert(queryResult.results.bindings, moduleMapping) as Array<ProductionModule>;
      return productionModules;

    } catch (error) {
      console.error(`Error while returning all mfgModules, ${error}`);
      throw new Error(error);
    }
  }


  async getModuleByIri(moduleIri: string): Promise<ProductionModule> {
    try {
      const queryResult = await this.graphDbConnection.executeQuery(`PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
        SELECT ?module WHERE {
            BIND(IRI("${moduleIri}") AS ?module).
            ?module a VDI3682:TechnicalResource.
        }`
      );
      const productionModule = converter.convert(queryResult.results.bindings, moduleMapping) as ProductionModule;
      return productionModule;
    } catch (error) {
      console.error(`Error while returning module with IRI '${moduleIri}'`);
      throw new Error(error);
    }
  }


  async deleteModule(moduleIri: String) {
    try {
      // Get module's graph
      // TODO: This could be moved into a separate graph model
      // TODO: Make sure descriptions of executable skills get deleted as well
      const graphQueryResults = await this.graphDbConnection.executeQuery(`PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
        SELECT ?s ?g WHERE {
            GRAPH ?g {
                BIND(IRI("${moduleIri}") AS ?s).
                {
                  ?s a VDI3682:TechnicalResource.
                } UNION {
                  ?s VDI3682:TechnicalResourceIsAssignedToProcessOperator ?x.
                }
            }
        }`
      );

      const resultBindings = graphQueryResults.results.bindings;
      resultBindings.forEach(binding => {
        const graphName = binding.g.value;
        this.graphDbConnection.clearGraph(graphName);  // clear graph
      });
    } catch (error) {
      console.error(`Error while returning all modules, ${error}`);
      throw new Error(error);
    }
  }

}


export interface ProductionModule {
  iri: string;
  interfaces?: Array<ModuleInterface>;
  components?: Array<Component>;
}

export interface ModuleInterface {
  iri: string;
  connectedIris: Array<string>;
}

export interface Component {
  iri: string;
  components: Array<Component>;
}
