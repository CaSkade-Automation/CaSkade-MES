var express = require('express');
var router = express.Router();
var path = require('path');

var modules = [];

/* add a new module to the list */
router.post('/modules', function (req, res) {
  console.log("new module registered");
  
  newModule = {
    "name": req.body.moduleName,
    "capability": req.body.moduleCapability
  }

  modules.push(newModule);
  res.send("module sucessful registered");
});

/* get all modules*/
router.get('/modules', function (req, res) {
  res.send(modules);
});


module.exports = router;
