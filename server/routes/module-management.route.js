var express = require('express');
var router = express.Router();
var QueryMapper = require('../models/selfdescription/GraphQueryMapper')
var queryMapper = new QueryMapper();

module.exports = function (socketServer, graphDbConnection) {
  
  var modules = new Array();


  /* get all modules*/
  router.get('', function (req, res) {
    // get the query to find all modules with their processes
    let query = require('../queries/select_allModules_NEW');
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



  /* add a new module to the list */
  router.post('', function (req, res) {
    let newSelfDescription = req.body;

    graphDbConnection.addRdfDocument(newSelfDescription, function(err, result){
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


  /** Remove a module from the list by its header id  */
  router.delete('/:moduleId', function(req, res) {
    let moduleId = req.params['moduleId'];

    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      if (module.header.id == moduleId) {
        modules.splice(i, 1);
      }
    }

    // TODO: Send something to the module to really disconnect
    res.status(200).json("Module successfully disconnected");
  })


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
