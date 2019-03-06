import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from "rxjs";
import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080';

@Injectable()
export class SocketService {
    private socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public send(message: string): void {
        this.socket.emit('message', {msg: message}, function(){
            console.log("service sent message")
        });
    }

    public onMessage(topic:string): Observable<any> {
        console.log("topic is: " + topic)
        return new Observable<any>(observer => {
            this.socket.on(topic, (data: any) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }

    public getSocket(){
        return this.socket;
    }
}