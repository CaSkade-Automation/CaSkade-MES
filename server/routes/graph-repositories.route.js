const express = require('express');
const router = express.Router();
const request = require('request');
const QueryMapper = require('../models/selfdescription/GraphQueryMapper');
const queryMapper = new QueryMapper();

module.exports = function (graphDbConnection) {

  // Gets all repositories of the graph db that the server is connected with
  router.get('', function (req, res) {

    // Create a base64-encoded authString with the Buffer class
    let authString = new Buffer.from("ops:ops");  
    let authStringBase64 = "Basic " + authString.toString('base64');

    graphDbConnection.getRepositories().then(
      repos => {
        const mappedRepositories = queryMapper.mapQueryResults(repos.data.results.bindings, mapObjectArray)
        res.status(200).send(mappedRepositories)
      }
    ).catch(error =>
      res.status(500).json({"msg": "Error while getting repositories",
                            "error": error})
    );
  });

  router.get('/0', function (req, res) {
    const selectedRepoTitle = graphDbConnection.getSelectedRepo();
    res.status(200).json(selectedRepoTitle)
  });

  /**
   * Set a new host configuration
   */
  router.put('', function(req, res) {
    const newHost = req.body;
    // make sure host has protocol set
    if (!newHost.host.includes("://")) {
      newHost.host = "http://" + newHost.host;
    }
    graphDbConnection.changeHost(newHost);  
    res.status(200).json("Changed graphDB host");
  })


  // update parts of the grahpDBconnection
  router.patch('/0', function (req, res) {
    let propToUpdate = req.body;
    let reqKeys = Object.keys(propToUpdate);

    if (reqKeys.length == 1 && graphDbConnection[reqKeys[0]] != undefined) {
      graphDbConnection[reqKeys[0]] = propToUpdate[reqKeys[0]];
      res.status(200).json(graphDbConnection);
    } else {
      res.status(400).end('Key doesn\' exist or more than one keys given');
    }
  });

  

  return router;
}

const mapObjectArray = [
  {
      object: 'uri',
      name: 'uri',
      childRoot: 'properties',
      toCollect: ['readable', 'writable', 'id', 'title'],
  },
];