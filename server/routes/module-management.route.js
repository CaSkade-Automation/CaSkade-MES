var express = require('express');
var router = express.Router();
var QueryMapper = require('../models/selfdescription/GraphQueryMapper')
var queryMapper = new QueryMapper();
const uuidv4 = require('uuid/v4');
const ModuleModel = require('./../models/module.model');
const moduleModel = new ModuleModel();

module.exports = function (socketServer, graphDbConnection) {

  /* get all mfgModules*/
  router.get('', function (req, res) {
    moduleModel.getAllModules().then((mfgModuleQueryResult) => {
      const mfgModules = mfgModuleQueryResult.results.bindings;
      res.status(200).json(mfgModules);
    })
      .catch((err) => {
        res.status(500).send(`Error while retrieving all mfgModules, ${err}`)
      });
  });


  /* get one mfgModule by IRI*/
  router.get('/:mfgModuleIri', function (req, res) {
    const mfgModuleIri = decodeURIComponent(req.params.mfgModuleIri);

    moduleModel.getModuleByIri(mfgModuleIri).then((mfgModuleQueryResult) => {
      const mfgModule = mfgModuleQueryResult.results.bindings;
      res.status(200).json(mfgModule);
    })
      .catch((err) => {
        res.status(500).send(`Error while retrieving all mfgModules, ${err}`)
      });
  });



  /* Insert a new mfgModule that is defined within an rdf-document */
  router.post('', function (req, res) {
    const newSelfDescription = req.body;

    // create a graph name (uuid)
    const graphName = uuidv4();

    graphDbConnection.addRdfDocument(newSelfDescription, graphName)
      .then((dbResult) => {
        // TODO: Check for errors from graphdb (e.g. syntax error while inserting)
        socketServer.emitmfgModuleRegistrationEvent("newmfgModule");
        res.status(201).json("mfgModule successfully registered");
      })
      .catch((err) => {
        res.status(400).json(
          {
            "msg": "Error while registering a new mfgModule",
            "err": err,
          }
        );
      })
  });


  /**
   * Remove a mfgModule by it's IRI
   */
  router.delete('/:mfgModuleIri', function (req, res) {
    let moduleIri = decodeURIComponent(req.params['mfgModuleIri']);

    moduleModel.deleteModule(moduleIri).then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.status(400).send(`Error while trying to delete a mfgModule: ${err}`)
    });
  })


  // TODO: Move this to subroutes

  /* get all capabilities of a mfgModule*/
  router.get('/:mfgModuleIri/capabilities', function (req, res) {
    const mfgModuleIri = decodeURIComponent(req.params.mfgModuleIri);
    console.log(mfgModuleIri);

    let query = require('../queries/select_allmfgModuleCapabilities')(mfgModuleIri);

    // query mfgModules from DB
    graphDbConnection.executeQuery(query)
      .then((dbResult) => {
        const mappedResult = queryMapper.mapQueryResults(dbResult.results.bindings, processMapObjectArray);
        res.status(200).send(mappedResult)
      })
      .catch((err) => {
        res.status(400).send(err)
      })
  });


  /**Add a new service to a mfgModule */
  router.post('/:mfgModuleIri/capabilities', function (req, res) {
    const newService = req.body;

    // create a graph name for the service (uuid)
    const serviceGraphName = uuidv4();

    graphDbConnection.addRdfDocument(newService, serviceGraphName)
      .then((dbResult) => {
        // TODO: Check for errors from graphdb (e.g. syntax error while inserting)
        socketServer.emitmfgModuleRegistrationEvent("newmfgModule");
        res.status(201).json("New capability successfully added");
      })
      .catch((err) => {
        res.status(400).json(
          {
            "msg": "Error while adding a new capability",
            "err": err,
          }
        );
      })
  });




  /** Delete a capability */
  router.delete('/:mfgModuleIri/capabilities/:capabilityName', function (req, res) {
    // TODO: Implement when mfgModules are able to kill a service
    res.send("Not yet implemented");
  });


  return router;
};






// TODO: Can be removed
const mfgModuleMapObjectArray = [
  {
    object: 'mfgModule',
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
