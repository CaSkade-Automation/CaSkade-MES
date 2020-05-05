import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';


@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private config = { url: 'http://localhost:9090', options: {} };
    private socket;

    constructor() {
        this.socket = io(this.config.url);
    }

    getMessage() {
        return this.socket.fromEvent('moduleregistration');
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
        console.log("sending")
        this.socket.emit('message', msg, function () {
            console.log('sending completed');
        });
    }
}
