//Broadcast Client receiving sent messages
var PORT = 15000;
var HOST = '0.0.0.0'; //this is your own IP
var dgram = require('dgram');
var udpClient = dgram.createSocket('udp4');
var request = require('request');
var AAS = require('./models/aas.model');

udpClient.bind(PORT, HOST, function () {
  console.log("listening for UDP traffic on");
});


udpClient.on('message', function (message, remote) {
  console.log('Broadcast Msg: From: ' + remote.address + ':' + remote.port + ' - ' + message);

  // parse message and create address to get the modules AAS
  //jsonMsg = JSON.parse(message)
  //aasAddress = 'http://' + remote.address + ':' + jsonMsg.port + jsonMsg.aasUrl;

  // create OPS AAS
  opsAas = new AAS(1, "Order Processing System", ["Process Orders", "Calculate KPIs"]);

  udpClient.send("hello back", 15001, function(){
    console.log("sent back")
  });

  // send the request
  request.post({
      url: "aasAddress",
      body: JSON.stringify(opsAas)
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
