var express = require('express');
var router = express.Router();
var QueryMapper = require('../models/selfdescription/GraphQueryMapper')
var queryMapper = new QueryMapper();
const uuidv4 = require('uuid/v4');

module.exports = function (socketServer, graphDbConnection) {


  // get all capabilities
  router.get('', function (req, res) {
    moduleModel.getAllModules().then((mfgModuleQueryResult) => {
      const mfgModules = mfgModuleQueryResult.results.bindings;
      res.status(200).json(mfgModules);
    })
      .catch((err) => {
        res.status(500).send(`Error while retrieving all mfgModules, ${err}`)
      });
  });



  // **DELETE A CAPABILITY**
  router.delete('/:capabilityIri', function (req, res) {
    const capabilityIri = decodeURIComponent(req.params['capabilityIri']);

    // Query to get capability by IRI
    const query = `PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
    SELECT ?process ?graph WHERE {
        GRAPH ?graph {

            BIND(IRI("${capabilityIri}") AS ?process).

            {
            ?process a VDI3682:Process.
            }
        }
    }`;
    // execute query
    graphDbConnection.executeQuery(query)
      .then((dbResult) => {
        const dbResultBindings = dbResult.results.bindings;
        dbResultBindings.forEach(bindings => {
          const graphName = bindings.graph.value;

          // clear every graph
          graphDbConnection.clearGraph(graphName);
        });
        res.status(204).end();
      })
      .catch((err) => {
        res.status(400).json(
          {
            "msg": "Error while trying to delete a capability by its IRI",
            "err": err,
          }
        );
      })
  });
  return router;
};







