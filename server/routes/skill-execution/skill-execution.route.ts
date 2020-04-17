// const express = require('express');
// const router = express.Router();
// const axios = require('axios');

// // Get all pending service excecutions
// router.get('', function (req, res){
//   res.status(200).json('Nothing here yet')
// })



// /**
//  * Add a new service that shall be executed
//  */
// router.post('', function(req, res) {
//   serviceDescription = req.body;

//   let queryParams = [];
//   serviceDescription.parameters.filter(parameter => {
//     if((parameter.location == "other") && (parameter.type == "QueryParameter")) {
//       queryParams.push(parameter);
//     }
//   })

//   let requestBody = {};
//   serviceDescription.parameters.filter(parameter => {
//     if(parameter.location == "body") {
//       requestBody[parameter.name] = parameter.value;
//     }
//   })

//   // Execute the service request
//   axios({
//     headers: {'content-type' : 'application/json'},
//     method: serviceDescription.methodType,
//     url: serviceDescription.fullPath + createQueryParameterString(queryParams),
//     data: JSON.stringify(requestBody)
//   })
//   .then((serviceResponse) => {
//     res.status(200).json({
//       "msg": "Service execution added and executed",
//       "res": serviceResponse.data
//     });
//   })
//   .catch((serviceErr) => {
//     res.status(500).json({
//       "msg": "Internal Error while executing the service",
//       "err": serviceErr
//     });
//   })
// });


// module.exports = router;

// function createQueryParameterString(queryParameters) {
//   let queryParamString = "?";
//   queryParameters.forEach(queryParam => {
//     queryParamString += encodeURI(queryParam.name) + "=" + encodeURI(queryParam.value) + "&";
//   });
//   queryParamString.slice(0, -1);  // remove last "&"
//   return queryParamString;
// }
