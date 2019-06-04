var express = require('express');
var router = express.Router();
var QueryMapper = require('../models/selfdescription/GraphQueryMapper')
var queryMapper = new QueryMapper();
var SocketServer = require('../socket-server.js');

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
          let mappedResult = queryMapper.mapResultToModule(JSON.parse(result));
          res.status(200).send(mappedResult)
        }
    });
  });



  /* add a new module to the list */
  router.post('', function (req, res) {
    let newSelfDescription = req.body;

    let socketServer = new SocketServer(req.connection.server);
    socketServer.emitNewSelfDescription(newSelfDescription);
    
    graphDbConnection.addRdfDocument(newSelfDescription, function(err, result){
      if(result){
        res.status(201).json("Module successfully registered");
      } else {
        res.status(400).json(err);
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
