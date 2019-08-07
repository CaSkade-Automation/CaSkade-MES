const express = require('express');
const router = express.Router();
const request = require('request'); 


router.get('', function (req, res){
  res.status(200).json('Nothing here yet')
})

/**
 * Add a new service that shall be executed
 */
router.post('', function(req, res) {
  serviceDescription = req.body;

  let queryParams = [];
  serviceDescription.parameters.filter(parameter => {
    if((parameter.location == "other") && (parameter.type == "QueryParameter")) {
      queryParams.push(parameter);
    }
  })

  let requestBody = {};
  serviceDescription.parameters.filter(parameter => {
    if(parameter.location == "body") {
      requestBody[parameter.name] = parameter.value;
    }
  })

  // Execute the service request
  request({
    headers: {'content-type' : 'application/json'},
    method: serviceDescription.methodType,
    uri: serviceDescription.fullPath + createQueryParameterString(queryParams),
    body: JSON.stringify(requestBody)
  }, 
  function(serviceErr, serviceRes){
    if(serviceErr) {
      res.status(500).json({
                            "msg": "Error while executing the service",
                            "err": serviceErr
                          });
    } else {
      res.status(200).json({
        "msg": "Service execution added and executed",
        "res": serviceRes.body
      });
    }
  });
});


module.exports = router;

function createQueryParameterString(queryParameters) {
  let queryParamString = "?";
  queryParameters.forEach(queryParam => {
    queryParamString += encodeURI(queryParam.name) + "=" + encodeURI(queryParam.value) + "&";
  });
  queryParamString.slice(0, -1);  // remove last "&"
  return queryParamString;
}