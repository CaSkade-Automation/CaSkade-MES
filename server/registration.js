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

  // parse message to get the infos that are necessary for registration
  let moduleBroadCast = JSON.parse(message)
  let modulePort = moduleBroadCast['port'];
  moduleAddress = `http://${remote.address}`;
  let selfDescriptionEndpoint = moduleBroadCast['self-descriptions']; 


  // Create the answer (specifying registration endpoint)
  let broadcastAnswer = {
    "id": 1,
    "port": 9090,
    "module-endpoint": "/modules"
  };


  udpClient.send(JSON.stringify(broadcastAnswer), remote.port, remote.address, function(err) {
    console.log(`Sending to address: ${remote.address}`);
    console.log(`Sending to port: ${remote.port}`);
    if (err) {
      console.log(`Error while answering broadcast, ${err}`);
    }
    else console.log(`Sent broadcast answer to ${moduleAddress}`);
  });
  
  
  // // send the request to the module
  // request.post({
  //   url: encodeURI(moduleAddress + opsRegistrationLocation),
  //   json: opsSelfDescription
  // },
  // function (error, response, body) {
  //   console.log('error: ' + error);
  //   console.log('body' + body);
  //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // });


});

udpClient.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
});
