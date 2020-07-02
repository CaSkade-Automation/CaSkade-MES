import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse} from '@nestjs/websockets';
import { Server} from 'socket.io';

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


  // emitNewSelfDescription (selfDescription) {
  //   this.io.emit('moduleregistration', selfDescription);
  // };


  /**
   * Emits an event with a given message
   * @param {string} message The message to be emitted
   */
  emitEvent(message) {
      console.log("emitting event");
      this.server.emit("message", message);
  }

}
