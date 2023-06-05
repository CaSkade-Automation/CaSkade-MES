import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseSocketMessageType, WebSocketMessage } from '@shared/models/socket-communication/SocketData';
import { filter } from 'rxjs/operators';
import { SocketConnection } from './SocketConnection';
import { CapabilityDto } from '@shared/models/capability/Capability';


@Injectable({
    providedIn: 'root'
})
export class CapabilitySocketService implements OnDestroy {

    private readonly WS_ENDPOINT = "ws://localhost:9091/capabilities";
    private socketConnection: SocketConnection<CapabilityDto[]>;
    constructor() {
        this.socketConnection = new SocketConnection<CapabilityDto[]>();
    }

    connect(): void {
        this.socketConnection.connect(this.WS_ENDPOINT);
    }

    getCapabilityAdded(): Observable<WebSocketMessage<CapabilityDto[]>> {
        return this.socketConnection.socket$.pipe(
            filter((val: WebSocketMessage<CapabilityDto[]>) => val.type == BaseSocketMessageType.Added));
    }

    getCapabilityDeleted(): Observable<WebSocketMessage<CapabilityDto[]>> {
        return this.socketConnection.socket$.pipe(
            filter((val: WebSocketMessage<CapabilityDto[]>) => val.type == BaseSocketMessageType.Deleted));
    }

    getCapabilityChanged(): Observable<WebSocketMessage<CapabilityDto[]>> {
        return this.socketConnection.socket$.pipe(
            filter((val: WebSocketMessage<CapabilityDto[]>) => val.type == BaseSocketMessageType.Changed));
    }

    ngOnDestroy(): void {
        this.socketConnection.socket$.complete();
    }
}
