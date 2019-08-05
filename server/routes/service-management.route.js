var express = require('express');
var router = express.Router();
var QueryMapper = require('../models/selfdescription/GraphQueryMapper')
var queryMapper = new QueryMapper();
const uuidv4 = require('uuid/v4');

module.exports = function (socketServer, graphDbConnection) {
  

  //TODO: Get all


  return router;
};







// const moduleMapObjectArray = [
//   {
//       object: 'module',
//       name: 'name',
//       childRoot: 'processes'
//   },
//   {
//       object: 'process',
//       name: 'name',
//       childRoot: 'methods'
//   },
//   {
//       object: 'method',
//       toCollect: ['resourcesBase', 'resourcePath', 'methodType'],
//       name: 'name',
//       childRoot: 'parameters'
//   },
//   {
//       object: 'param',
//       name: 'fullName',
//       toCollect: ['paramDataType', 'paramName', 'paramType', 'paramLocation'],
//       childRoot: 'paramOptions'
//   },
//   {
//       object: 'paramOption',
//       name: 'name',
//       childRoot: 'options'
//   }
// ];
