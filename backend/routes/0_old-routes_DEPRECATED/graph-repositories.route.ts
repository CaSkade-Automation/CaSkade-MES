// const express = require('express');
// const router = express.Router();
// const QueryMapper = require('../models/selfdescription/GraphQueryMapper');
// const queryMapper = new QueryMapper();

// module.exports = function (graphDbConnection) {

//   // Gets all repositories of the graph db that the server is connected with
//   router.get('', function (req, res) {

//     // Create a base64-encoded authString with the Buffer class
//     let authString = new Buffer.from("ops:ops");
//     let authStringBase64 = "Basic " + authString.toString('base64');

//     graphDbConnection.getRepositories().then(repos => {
//       const repositories = repos.data.results.bindings;

//         const mappedRepositories = queryMapper.mapQueryResults(repositories, mapObjectArray)
//         res.status(200).send(mappedRepositories)
//       }
//     ).catch(error =>
//       res.status(500).json({
//         "msg": "Error while getting repositories",
//         "error": error
//       })
//     );
//   });

//   /** Returns the current configuration */
//   router.get('/config', function (req, res) {
//     const config = graphDbConnection.getConfig();
//     res.status(200).json(config);
//   });


//   /**
//    * Set a new host configuration
//    */
//   router.put('/config', function (req, res) {
//     const newHostConfig = req.body;
//     // make sure host has protocol set
//     if (!newHostConfig.host.includes("://")) {
//       newHostConfig.host = "http://" + newHostConfig.host;
//     }

//     graphDbConnection.changeConfig(newHostConfig).then(newConfig => {
//       res.status(200).send(newHostConfig);
//     }).catch(err => {
//       res.status(400).json({"err":"Invalid config"})
//     });

//   })


//   // update parts of the grahpDBconnection
//   router.patch('/config', function (req, res) {
//     let propToUpdate = req.body;
//     let reqKeys = Object.keys(propToUpdate);

//     if (reqKeys.length == 1 && graphDbConnection[reqKeys[0]] != undefined) {
//       graphDbConnection[reqKeys[0]] = propToUpdate[reqKeys[0]];
//       res.status(200).json(graphDbConnection);
//     } else {
//       res.status(400).end('Key doesn\' exist or more than one key given');
//     }
//   });



//   return router;
// }

// const mapObjectArray = [{
//   object: 'uri',
//   name: 'uri',
//   childRoot: 'properties',
//   toCollect: ['readable', 'writable', 'id', 'title'],
// }, ];
