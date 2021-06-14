import {OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server} from 'socket.io';
import { SocketEventName } from "@shared/socket-communication/SocketEventName";
import { StateChangeInfo } from "@shared/socket-communication/SocketData";

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {


    @WebSocketServer() server: Server;
    connectedClients = 0;

    handleConnection(client: any, ...args: any[]): void {
        this.connectedClients++;
    }

    handleDisconnect(client: any): void {
        this.connectedClients--;
    }

    /**
     * Sends out an info that a state of a skill has changed
     * @param stateChangeInfo
     */
    emitStateChangeInfo(stateChangeInfo: StateChangeInfo): void {
        this.emitEvent(SocketEventName.Skills_StateChanged, stateChangeInfo);
    }


    /**
   * Emits an event with a given message
   * @param {string} message The message to be emitted
   */
    emitEvent(eventName: SocketEventName, message?): void {
        this.server.emit(eventName, message);
    }

}
