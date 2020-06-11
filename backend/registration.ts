import { Socket, createSocket } from "dgram";
import { Logger } from '@nestjs/common';

export class BroadcastListener {
    port = 15000;
    host = '0.0.0.0'; //this is your own IP
    socket: Socket;
    logger = new Logger("BroadcastListener");

    // uuidv4 = require('uuid/v4');

    constructor() {
        // this.logger = new Logger("BroadcastListener");
        this.socket = createSocket("udp4");

        this.socket.bind(this.port, this.host);

        this.socket.on("listening", () => {
            this.logger.log(`Now listening for UDP communication on PORT: ${this.port}`);
        });

        this.socket.on('message', (message, remote) => {
            this.logger.log('Broadcast Msg: From: ' + remote.address + ':' + remote.port + '\nMessage: ' + message);

            // parse message to get the infos that are necessary for registration
            const moduleBroadCast = JSON.parse(message.toString());
            const modulePort = moduleBroadCast['port'];
            const moduleAddress = `http://${remote.address}`;
            const selfDescriptionEndpoint = moduleBroadCast['self-descriptions'];


            // Create the answer (specifying registration endpoint)
            const broadcastAnswer = {
                "id": 1,
                "port": 9090,
                "moduleEndpoint": "/api/modules",
                "capabilityEndpoint": "/api/capabilities",
                "skillEndpoint": "api/skills"
            };


            this.socket.send(JSON.stringify(broadcastAnswer), remote.port, remote.address, function (err) {
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
            // });)
        });
    }

    doSomething() {
        console.log("test");
    }
}

// // Create the UDP client and listen for traffic
// listen(): void {
//     this.udpClient.bind(PORT, HOST, function () {
//         console.log("listening for UDP traffic...");
//     });

// }

// //Broadcast Client receiving sent messages
// var PORT = 15000;
// var HOST = '0.0.0.0'; //this is your own IP
// var dgram = require('dgram');
// var udpClient = dgram.createSocket('udp4');
// var request = require('request');
// const uuidv4 = require('uuid/v4');



// // On received message:
// udpClient.on('message', function (message, remote) {
//   console.log('Broadcast Msg: From: ' + remote.address + ':' + remote.port + '\nMessage: ' + message);

//   // parse message to get the infos that are necessary for registration
//   let moduleBroadCast = JSON.parse(message)
//   let modulePort = moduleBroadCast['port'];
//   moduleAddress = `http://${remote.address}`;
//   let selfDescriptionEndpoint = moduleBroadCast['self-descriptions'];


//   // Create the answer (specifying registration endpoint)
//   let broadcastAnswer = {
//     "id": 1,
//     "port": 9090,
//     "moduleEndpoint": "/api/modules",
//     "capabilityEndpoint": "/api/capabilities"
//   };


//   udpClient.send(JSON.stringify(broadcastAnswer), remote.port, remote.address, function(err) {
//     console.log(`Sending to address: ${remote.address}`);
//     console.log(`Sending to port: ${remote.port}`);
//     if (err) {
//       console.log(`Error while answering broadcast, ${err}`);
//     }
//     else console.log(`Sent broadcast answer to ${moduleAddress}`);
//   });


//   // // send the request to the module
//   // request.post({
//   //   url: encodeURI(moduleAddress + opsRegistrationLocation),
//   //   json: opsSelfDescription
//   // },
//   // function (error, response, body) {
//   //   console.log('error: ' + error);
//   //   console.log('body' + body);
//   //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   // });


// });

// udpClient.on('error', (err) => {
//   console.log(`server error:\n${err.stack}`);
// });
