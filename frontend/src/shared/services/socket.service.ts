import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { SocketEventName } from '@shared/socket-communication/SocketEventName';


@Injectable({
    providedIn: 'root'
})
export class SocketService {

    constructor(private socket: Socket) {
        this.sendMessage("asdasd");
    }

    getMessage(topic: SocketEventName): Observable<any> {
        return this.socket.fromEvent(topic);
    }

    // Alternativ so:
    // public getMessages = () => {
    //     return Observable.create((observer) => {
    //         this.socket.on('new-message', (message) => {
    //             observer.next(message);
    //         });
    //     });
    // }


    sendMessage(msg: string) {
        console.log("sending");
        this.socket.emit(msg);
        this.socket.emit('message', msg, function () {
            console.log('sending completed');
        });
    }
}
