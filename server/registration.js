//Broadcast Client receiving sent messages
var PORT = 15000;
var HOST = '0.0.0.0'; //this is your own IP
var dgram = require('dgram');
var udpClient = dgram.createSocket('udp4');
var request = require('request');
const uuidv4 = require('uuid/v4');
var SelfDescription = require('./models/selfdescription/SelfDescription');
var ModuleFunction = require('./models/selfdescription/ModuleFunction');

udpClient.bind(PORT, HOST, function () {
  console.log("listening for UDP traffic...");
});


udpClient.on('message', function (message, remote) {
  console.log('Broadcast Msg: From: ' + remote.address + ':' + remote.port + '\nMessage: ' + message);

  // parse message to get module self description and address
  let moduleBroadCast = JSON.parse(message)
  moduleAddress = `http://'${remote.address}:${remote.port}`;
  let opsRegistrationLocation = moduleBroadCast.getFunctionByName('ops-registration').location; 
  

  // create OPS AAS
  opsSelfDescription = new SelfDescription(uuidv4(), 'Order Processing System', [
    new ModuleFunction('Order-Management', 'Create new Orders', '/api/order-management', 'post', [{'name':'customerName', 'dataType': 'string'}, {'productModel' : 'file'}]),
    new ModuleFunction('KPI-Dashboard', 'Allows for calculation and display of KPIs', '/api/kpi-calculation', 'post', [{'name':'nameOfKpi', 'dataType' : 'string'}]),
    new ModuleFunction('Module-Registration', 'Register new modules at this endpoint', '/api/module-registration', 'post', [{'name':'moduleSelfDescription', 'dataType' : 'SelfDescription'}])
  ]);
  
  // 

  // send the request
  request.post({
      url: moduleAddress + opsRegistrationLocation,
      body: JSON.stringify(opsSelfDescription)
    },
    function (error, response, body) {
      console.log('error: ' + error);
      console.log('body' + body);
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    });


});

udpClient.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
});
