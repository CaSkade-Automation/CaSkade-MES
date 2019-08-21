const express = require('express');
const router = express.Router();
const request = require('request');
const QueryMapper = require('../models/selfdescription/GraphQueryMapper');
const queryMapper = new QueryMapper();

module.exports = function (graphDbConnection) {

  /**
   * Send a new query to the current repository
   */
  router.post('/queries', function (req, res) {
    const queryString = req.body;

    graphDbConnection.executeQuery(queryString, function (err, dbResult) {
      if (err) {
        res.json(JSON.parse(dbResult));
      } else {
        res.json(JSON.parse(dbResult))
      }
    })
  });

  router.post('/statements', function (req, res) {
    let statement = req.body;
    const statementType = req.query.type;

    if (!statementType) {
      res.status(400).json("Missing parameter 'type'");
    } else {

      // Set correct contentType for GraphDB
      let contentType;
      switch (statementType) {
        case "updateString":
          contentType = "application/x-www-form-urlencoded";
          statement = `update=${statement}`;
          break;
        case "document":
          contentType = "application/rdf+xml";
          break;
      }

      graphDbConnection.executeStatement(statement, "", contentType, function (err, graphDbResponse) {
        if (err) {
          res.status(graphDbResponse.statusCode).send(`There was an error while executing this statement. Error: ${err}`);
        } else {
          res.status(graphDbResponse.statusCode).send(graphDbResponse.body)
        }
      })
    }
  });



  return router;
}
