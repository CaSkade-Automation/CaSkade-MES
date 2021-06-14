import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { SocketEventName } from '@shared/socket-communication/SocketEventName';
import { StateChangeInfo } from '@shared/socket-communication/SocketData';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class SocketService {

    constructor(private socket: Socket) {}

    getMessage<T>(topic: SocketEventName): Observable<T> {
        return this.socket.fromEvent(topic);
    }

    getStateChangesOfSkill(skillIri: string): Observable<string> {
        return this.getMessage<StateChangeInfo>(SocketEventName.Skills_StateChanged).pipe(map(msg => {
            console.log(msg);
            if(msg.skillIri == skillIri) {
                return msg.newStateTypeIri;
            }
        }));
    }


    sendMessage(msg: string) {
        console.log("sending");
        this.socket.emit(msg);
        this.socket.emit('message', msg, function () {
            console.log('sending completed');
        });
    }
}
