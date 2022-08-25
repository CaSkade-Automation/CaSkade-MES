import { OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from "@nestjs/websockets";
import {Server, WebSocket} from "ws";
import { v4 as uuidv4 } from 'uuid';
import { SocketMessageType, WebSocketMessage } from "@shared/models/socket-communication/SocketData";

export abstract class Websocket implements OnGatewayConnection, OnGatewayDisconnect{

    connectedClients = new Map<string, WebSocket>();
    @WebSocketServer() _server: Server;

    passServer(server: Server): void {
        this._server = server;
    }

    handleConnection(client: WebSocket, ...args: any[]): void {
        // Set new client with an id to the map
        const id = uuidv4();
        this.connectedClients.set(id, client);

        // As soon as the client closes connection, remove it from the map
        client.on("close", () => {
            this.connectedClients.delete(id);
        });
    }

    handleDisconnect(client: any): void {
        console.log("a client disconnected");
    }

    /**
   * Sends a message to all connected clients
   * @param {string} message The message to be emitted
   */
    sendMessage(messageType: SocketMessageType, messageBody?: any): void {
        // Create the message and send it to all connected clients
        const message = new WebSocketMessage(messageType, messageBody);
        this.connectedClients.forEach(client => {
            client.send(JSON.stringify(message));
        });

    }

}
