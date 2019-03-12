


module.exports = function (socketServer) {
  var express = require('express');
  var router = express.Router();
  // var SocketServer = require('../socket-server.js');
  var SelfDescription = require('../models/selfdescription/SelfDescription');

  var modules = new Array();


  /* get all modules*/
  router.get('', function (req, res) {
    res.status(200).send(modules);
  });


  /* add a new module to the list */
  router.post('', function (req, res) {
    let postedSelfDescription = req.body;
    
    newModuleSelfDescription = new SelfDescription(postedSelfDescription.header.id, postedSelfDescription.header.name, postedSelfDescription.body.moduleFunctions)
    modules.push(newModuleSelfDescription);
    
    // let socketServer = new SocketServer(req.connection.server);
    socketServer.emitNewSelfDescription(newModuleSelfDescription);
    res.status(201).send("Module sucessfully registered");
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
    res.status(200).json("Module successfully disconnected");
  })


  return router;
};
