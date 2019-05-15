var express = require('express');
var router = express.Router();
var request = require('request');

let graphDbServer = "http://139.11.207.25:7200";


// Gets all repositories of the graph db that the server is connected with
router.get('', function (req, res) {
  let repositories;

  // Create a base64-encoded authString with the Buffer class
  let authString = new Buffer.from("ops:ops");  
  let authStringBase64 = "Basic " + authString.toString('base64');

  // get all repositories of the graphdb
  request.get({
    url: encodeURI(graphDbServer + `/repositories`),
    headers: {
      "Authorization" : authStringBase64,
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

module.exports = router;