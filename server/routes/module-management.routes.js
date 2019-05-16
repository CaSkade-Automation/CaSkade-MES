var express = require('express');
var router = express.Router();
var request = require('request');


module.exports = function (socketServer, graphDbConnection) {
  // var SocketServer = require('../socket-server.js');
  var SelfDescription = require('../models/selfdescription/SelfDescription');

  var modules = new Array();


  /* get all modules*/
  router.get('', function (req, res) {
    console.log('get all modules');
    
    // query modules from DB
    graphDbConnection.executeQuery(req.body, function(success, err) {
      console.log(`posted req.body ${req.body}`);
      
        if (!success) {
          res.status(400).send(err)
        } else {
          res.status(200).send(success)
        }
    });
  });



  /* add a new module to the list */
  router.post('', function (req, res) {
    let newSelfDescription = req.body;

    console.log(`new SelfDescription: ${newSelfDescription}`);
    
    // let socketServer = new SocketServer(req.connection.server);
    //socketServer.emitNewSelfDescription(newModuleSelfDescription);
    
    graphDbConnection.addRdfDocument(newSelfDescription, function(success, err){
      if(success){
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
