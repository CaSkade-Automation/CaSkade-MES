const GraphDbConnection = require('./../util/graphDbConnection');

module.exports = class ModuleModel {

  constructor() {
    this.graphDbConnection = new GraphDbConnection();
  }

  async getAllModules() {
    try {
      const mfgModules = this.graphDbConnection.executeQuery(`PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
        SELECT ?mfgModule WHERE {
          ?mfgModule a VDI3682:TechnicalResource.
        }`
      );
      return mfgModules;
    } catch (error) {
      console.error(`Error while returning all mfgModules, ${error}`);
      throw new Error(error);
    }
  }

  async getModuleByIri(moduleIri) {
    try {
      const mfgModule = this.graphDbConnection.executeQuery(`PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT ?module WHERE {
            BIND(IRI('moduleIri') AS ?module).
            ?module a VDI3682:TechnicalResource.
        }`
      );
      return mfgModule;
    } catch (error) {
      console.error(`Error while returning module with IRI '${moduleIri}'`);
      throw new Error(error);
    }
  }

  /**
   * Deletes a module along with it's capabilities and skills
   * @param {string} moduleIri IRI of the module that will be deleted
   */
  async deleteModule(moduleIri) {
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
        graphDbConnection.clearGraph(graphName);  // clear graph
      });
    } catch (error) {
      console.error(`Error while returning all modules, ${error}`);
      throw new Error(error);
    }
  }
}
