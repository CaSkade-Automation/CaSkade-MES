var express = require('express');
var router = express.Router();
var request = require('request');

module.exports = function (graphDbConnection) {

  // Gets all repositories of the graph db that the server is connected with
  router.get('', function (req, res) {

    // Create a base64-encoded authString with the Buffer class
    let authString = new Buffer.from("ops:ops");  
    let authStringBase64 = "Basic " + authString.toString('base64');

    // get all repositories of the graphdb
    request.get({
      url: graphDbConnection.getRepositoriesEndpoint(),
      headers: {
        "Authorization" : graphDbConnection.createBase64AuthString(),
        "Accept": "application/json"
      }
    },
    function (err, response, body) {
      if(err) {
        console.log('error: ');
        res.statusCode(500).end("Error while contacting the graph DB");
      }
      else{
      console.log('body' + body);
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      res.send(body);
      }
    });
  });

  // update parts of the grahpDBconnection
  router.patch('', function (req, res) {
    let propToUpdate = req.body;
    let reqKeys = Object.keys(propToUpdate);

    if (reqKeys.length == 1 && graphDbConnection.dbConfig[reqKeys[0]] != undefined) {
      console.log(`changing value ${propToUpdate} in graphDbConfig`);
      
      graphDbConnection.dbConfig[reqKeys[0]] = propToUpdate[reqKeys[0]];
      res.status(200).json(graphDbConnection);
    } else {
      res.status(400).end('Key doesn\' exist or more than one keys given');
    }
  });

  return router;
}