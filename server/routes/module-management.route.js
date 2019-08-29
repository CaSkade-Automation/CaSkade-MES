var express = require('express');
var router = express.Router();
var QueryMapper = require('../models/selfdescription/GraphQueryMapper')
var queryMapper = new QueryMapper();
const uuidv4 = require('uuid/v4');

module.exports = function (socketServer, graphDbConnection) {
  
  /* get all modules*/
  router.get('', function (req, res) {
    // get the query to find all modules with their processes
    let query = require('../queries/select_allModules');
    // query modules from DB
    graphDbConnection.executeQuery(query, function(err, result) {
        if (!result) {
          res.status(400).send(err)
        } else {
          let mappedResult = queryMapper.mapQueryResults(JSON.parse(result).results.bindings, moduleMapObjectArray);
          res.status(200).send(mappedResult)
        }
    });
  });


  /* get one module by name*/
  router.get('/:moduleName', function (req, res) {
    const moduleName = req.params.moduleName;
    const query = require('../queries/select_oneModuleByName')(moduleName);

    graphDbConnection.executeQuery(query, function(err, result) {
      if (!result) {
        res.status(400).send(err)
      } else {
        let mappedResult = queryMapper.mapQueryResults(JSON.parse(result).results.bindings, moduleMapObjectArray);
        res.status(200).send(mappedResult)
      }
    });
  });



  /* Insert a new module that is defined within an rdf-document */
  router.post('', function (req, res) {
    const newSelfDescription = req.body;
    
    // create a graph name (uuid)
    const graphName = uuidv4();

    graphDbConnection.addRdfDocument(newSelfDescription, graphName, function(err, result){
      if(result){
        // TODO: Check for errors from graphdb (e.g. syntax error while inserting)
        socketServer.emitModuleRegistrationEvent("newModule");
        res.status(201).json("Module successfully registered");
      } else {
        res.status(400).json(
          {"msg": "Error while registering a new module",
          "err": err,
          }
        );
      }
    });

  });


  /**
   * Remove a module by it's IRI
   */
  router.delete('/:moduleIri', function(req, res) {
    let moduleIri = decodeURIComponent(req.params['moduleIri']);

    // query to get graph of the module IRI
    const query = `
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
    }`;
    
    // get all module's graph names
    graphDbConnection.executeQuery(query, function(err,queryResult) {
      queryResult = JSON.parse(queryResult)
      
      queryResult.results.bindings.forEach(binding => {
        const graphName = binding.g.value;

        // clear every graph
        graphDbConnection.clearGraph(graphName, function(err, res){
        });
      });
    });

    // TODO: Provide useful and correct feedback
    res.status(204).end();
  })


  /* get all capabilities of a module*/
  router.get('/:moduleIri/capabilities', function (req, res) {
    const moduleIri = decodeURIComponent(req.params.moduleIri);
    console.log(moduleIri);
    
    let query = require('../queries/select_allModuleCapabilities')(moduleIri);
    
    // query modules from DB
    graphDbConnection.executeQuery(query, function(err, result) {
        if (!result) {
          res.status(400).send(err)
        } else {
          let mappedResult = queryMapper.mapQueryResults(JSON.parse(result).results.bindings, processMapObjectArray);
          res.status(200).send(mappedResult)
        }
    });
  });


  /**Add a new service to a module */
  router.post('/:moduleIri/capabilities', function (req, res) {
    const newService = req.body;
    
    // create a graph name for the service (uuid)
    const serviceGraphName = uuidv4();

    graphDbConnection.addRdfDocument(newService, serviceGraphName, function(err, result){
      if(result){
        // TODO: Check for errors from graphdb (e.g. syntax error while inserting)
        socketServer.emitModuleRegistrationEvent("newModule");
        res.status(201).json("New capability successfully added");
      } else {
        res.status(400).json(
          {"msg": "Error while adding a new capability",
          "err": err,
          }
        );
      }
    });
  });




  /** Delete a capability */
  router.delete('/:moduleIri/capabilities/:capabilityName', function (req, res) {
    // TODO: Implement when modules are able to kill a service
  });


  return router;
};







const moduleMapObjectArray = [
  {
      object: 'module',
      name: 'name',
      childRoot: 'processes'
  },
  {
      object: 'process',
      name: 'name',
  },
];


const processMapObjectArray = [
  {
    object: 'process',
    name: 'name',
    childRoot: 'methods'
  },
  {
    object: 'method',
    toCollect: ['resourcesBase', 'resourcePath', 'methodType'],
    name: 'name',
    childRoot: 'parameters'
  },
  {
    object: 'param',
    name: 'fullName',
    toCollect: ['paramDataType', 'paramName', 'paramType', 'paramLocation'],
    childRoot: 'paramOptions'
  },
  {
    object: 'paramOption',
    name: 'name',
    childRoot: 'options'
  }
];