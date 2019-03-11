import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(public socket: Socket) { }
  getMessage() {  
    return this.socket
        .fromEvent<any>('moduleregistration');
}

sendMessage(msg: string) {
    console.log("sending")
    this.socket.emit('message', msg, function () {
        console.log('sending completed');
    });
}
}