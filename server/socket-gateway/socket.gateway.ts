import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse} from '@nestjs/websockets';
import {Client, Server} from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  connectedClients: number = 0;

  handleConnection(client: any, ...args: any[]) {
    this.connectedClients++;
  }

  handleDisconnect(client: any) {
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
    this.server.emit('moduleregistration', message);
  }

}
