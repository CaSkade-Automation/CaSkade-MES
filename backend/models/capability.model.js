const GraphDbConnection = require('./../util/graphDbConnection');

module.exports = class CapabiltiyModel {

  constructor() {
    this.graphDbConnection = new GraphDbConnection();
  }

  // TODO: Add in- and outputs
  async getAllCapabilities() {
    try {
      const capabilities = this.graphDbConnection.executeQuery(`PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
        SELECT ?capability WHERE {
          ?capability a VDI3682:Process.
        }`
      );
      return capabilities;
    } catch (error) {
      console.error(`Error while returning all capabilities, ${error}`);
      throw new Error(error);
    }
  }

  // TODO: Add in- and outputs
  async getCapabilityByIri(moduleIri) {
    try {
      const capability = this.graphDbConnection.executeQuery(`PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
        SELECT ?capability WHERE {
          BIND(IRI('capabilityIri') AS ?capability).
          ?capability a VDI3682:Process.
        }`
      );
      return capability;
    } catch (error) {
      console.error(`Error while returning capability with IRI '${moduleIri}'`);
      throw new Error(error);
    }
  }


  /**
   * Deletes a capability along with its skills
   * @param {string} capabilityIri IRI of the capability that will be deleted
   */
  async deleteCapability(capabilityIri) {
    try {
      // Get capability's graph and delete all contents
      // TODO: This could be moved into a separate graph model
      // TODO: Make sure descriptions of executable skills get deleted as well
      const graphQueryResults = await this.graphDbConnection.executeQuery(`
        PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
        PREFIX OPS: <http://www.hsu-ifa.de/ontologies/OPS-KnowledgeBase#>
        SELECT ?c ?g WHERE {
            GRAPH ?g {
                BIND(IRI("${capabilityIri}") AS ?c).
                {
                  ?c a VDI3682:Process.
                } UNION {
                  ?c OPS:IsExecutableVia ?x.
                }
            }
        }`
      );

      const resultBindings = graphQueryResults.results.bindings;
      resultBindings.forEach(binding => {
        const graphName = binding.g.value;
        graphDbConnection.clearGraph(graphName);
      });
    } catch (error) {
      console.error(`Error while returning all modules, ${error}`);
      throw new Error(error);
    }
  }
}
