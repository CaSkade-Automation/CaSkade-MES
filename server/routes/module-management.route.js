var express = require('express');
var router = express.Router();
var QueryMapper = require('../models/selfdescription/GraphQueryMapper')
var queryMapper = new QueryMapper();
const uuidv4 = require('uuid/v4');

module.exports = function (socketServer, graphDbConnection) {
  
  var modules = new Array();


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
    let newSelfDescription = req.body;
    
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

        graphDbConnection.clearGraph(graphName, function(err, res){
          console.log(res);
        });
      });
    });

    // TODO: Provide useful and correct feedback

    res.status(200).json("Module successfully disconnected");
  })


  /* get all processes of a module*/
  router.get('/:moduleIri/services', function (req, res) {
    const moduleIri = decodeURIComponent(req.params.moduleIri);
    console.log(moduleIri);
    
    // get the query to find this module's processes
    let query = require('../queries/select_allModuleProcesses')(moduleIri);
    console.log("query");
    console.log(query);
    
    // query modules from DB
    graphDbConnection.executeQuery(query, function(err, result) {
        if (!result) {
          res.status(400).send(err)
        } else {
          let mappedResult = queryMapper.mapQueryResults(JSON.parse(result).results.bindings, processMapObjectArray);
          console.log("results");
          console.log(JSON.parse(result));
          
          
          res.status(200).send(mappedResult)
        }
    });
  });


  /**Add a new service to a module */
  router.post('/:moduleIri/services', function (req, res) {
    const newService = req.body;
    
    // create a graph name for the service (uuid)
    const serviceGraphName = uuidv4();

    graphDbConnection.addRdfDocument(newService, serviceGraphName, function(err, result){
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




  /** Delete a service */
  router.delete('/:moduleIri/services/:serviceName', function (req, res) {

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