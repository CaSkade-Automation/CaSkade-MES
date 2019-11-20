const express = require('express');
const router = express.Router();
const QueryMapper = require('../models/selfdescription/GraphQueryMapper');
const queryMapper = new QueryMapper();

module.exports = function (graphDbConnection) {

  /**
   * Send a new query to the current repository
   */
  router.post('/queries', function (req, res) {
    const queryString = req.body;

    graphDbConnection.executeQuery(queryString)
    .then((dbResult) => {
      res.json(dbResult);
    }).catch((err) => {
      res.status(400).send(err.message);
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

      graphDbConnection.executeStatement(statement, "", contentType)
        .then((dbResult) => {
          res.json('Statement successfully executed!');
        }).catch((err) => {
          res.status(400).send(err.message);
        })
    }
  });



  return router;
}
