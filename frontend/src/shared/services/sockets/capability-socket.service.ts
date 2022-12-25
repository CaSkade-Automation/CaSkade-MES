import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketMessageType, WebSocketMessage } from '@shared/models/socket-communication/SocketData';
import { filter } from 'rxjs/operators';
import { SocketConnection } from './SocketConnection';


@Injectable({
    providedIn: 'root'
})
export class CapabilitySocketService extends SocketConnection  implements OnDestroy {
    WS_ENDPOINT = "ws://localhost:9091/capabilities";

    getCapabilityAdded(): Observable<WebSocketMessage> {
        return this.socket$.pipe(filter((val: WebSocketMessage) => val.type == SocketMessageType.Added));
    }

    getCapabilityDeleted(): Observable<WebSocketMessage> {
        return this.socket$.pipe(filter((val: WebSocketMessage) => val.type == SocketMessageType.Deleted));
    }

    getCapabilityChanged(): Observable<WebSocketMessage> {
        return this.socket$.pipe(filter((val: WebSocketMessage) => val.type == SocketMessageType.Changed));
    }

    ngOnDestroy(): void {
        this.socket$.complete();
    }
}
