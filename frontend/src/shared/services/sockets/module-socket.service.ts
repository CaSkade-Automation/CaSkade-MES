import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { SocketMessageType, WebSocketMessage } from '@shared/models/socket-communication/SocketData';
import { SocketConnection } from './SocketConnection';

@Injectable({
    providedIn: 'root'
})
export class ModuleSocketService extends SocketConnection {


    WS_ENDPOINT = "ws://localhost:9091/modules";


    getModulesAdded(): Observable<WebSocketMessage> {
        return this.socket$.pipe(filter((val: WebSocketMessage) => val.type == SocketMessageType.Added));
    }

    getModulesChanged(): Observable<WebSocketMessage> {
        return this.socket$.pipe(filter((val: WebSocketMessage) => val.type == SocketMessageType.Changed));
    }

    getModulesDeleted(): Observable<WebSocketMessage> {
        return this.socket$.pipe(filter((val: WebSocketMessage) => val.type == SocketMessageType.Deleted));
    }

    ngOnDestroy(): void {
        this.socket$.complete();
    }
}
