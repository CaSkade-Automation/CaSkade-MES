import { Socket, createSocket } from "dgram";
import { Logger } from '@nestjs/common';

export class BroadcastListener {
    port = 15000;
    host = '0.0.0.0'; //this is your own IP
    socket: Socket;
    logger = new Logger("BroadcastListener");

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
                "basePath": "/api",
                "moduleEndpoint": "/modules",
                "capabilityEndpoint": "/capabilities",
                "skillEndpoint": "/skills",
            };


            this.socket.send(JSON.stringify(broadcastAnswer), remote.port, remote.address, function (err) {
                console.log(`Sending to address: ${remote.address}`);
                console.log(`Sending to port: ${remote.port}`);
                if (err) {
                    console.log(`Error while answering broadcast, ${err}`);
                }
                else console.log(`Sent broadcast answer to ${moduleAddress}`);
            });

        });
    }

    doSomething() {
        console.log("test");
    }
}
