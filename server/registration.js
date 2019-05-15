//Broadcast Client receiving sent messages
var PORT = 15000;
var HOST = '0.0.0.0'; //this is your own IP
var dgram = require('dgram');
var udpClient = dgram.createSocket('udp4');
var request = require('request');
const uuidv4 = require('uuid/v4');
var SelfDescription = require('./models/selfdescription/SelfDescription');
var ModuleFunction = require('./models/selfdescription/ModuleFunction');

// Create the UDP client and listen for traffic
udpClient.bind(PORT, HOST, function () {
  console.log("listening for UDP traffic...");
});


// On received message:
udpClient.on('message', function (message, remote) {
  console.log('Broadcast Msg: From: ' + remote.address + ':' + remote.port + '\nMessage: ' + message);

  // parse message to get module self description and address
  let moduleBroadCast = JSON.parse(message)
  let modulePort = moduleBroadCast['port'];
  moduleAddress = `http://${remote.address}:${modulePort}`;
  //let opsRegistrationLocation = moduleBroadCast.getFunctionByName('ops-registration').location; 
  let opsRegistrationLocation = moduleBroadCast['location']; 
  

  // create OPS AAS
  opsSelfDescription = new SelfDescription(123, 'Order Processing System', 9090, [
    new ModuleFunction('Order-Management', 'Create new Orders', '/api/order-management', 'POST', [{'name':'customerName', 'dataType': 'string'}, {'name': 'productModel', 'dataType' : 'file'}]),
    new ModuleFunction('KPI-Dashboard', 'Allows for calculation and display of KPIs', '/api/kpi-calculation', 'POST', [{'name':'nameOfKpi', 'dataType' : 'string'}]),
    new ModuleFunction('Module-Registration', 'Register new modules at this endpoint', '/api/modules', 'POST', [{'name':'moduleSelfDescription', 'dataType' : 'SelfDescription'}])
  ]);
  
  // 

  // send the request
  request.post({
      url: encodeURI(moduleAddress + opsRegistrationLocation),
      json: opsSelfDescription
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
