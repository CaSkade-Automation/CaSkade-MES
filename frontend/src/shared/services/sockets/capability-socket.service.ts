import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseSocketMessageType, WebSocketMessage } from '@shared/models/socket-communication/SocketData';
import { filter, map } from 'rxjs/operators';
import { SocketConnection } from './SocketConnection';
import { CapabilityDto } from '@shared/models/capability/Capability';
import { Capability } from '../../models/Capability';


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

    onCapabilitiesAdded(): Observable<Capability[]> {
        return this.socketConnection.socket$.pipe(
            filter((val: WebSocketMessage<CapabilityDto[]>) => val.type == BaseSocketMessageType.Added),
            map((msg: WebSocketMessage<CapabilityDto[]>) => msg.body.map(dto => new Capability(dto))),
        );
    }

    onCapabilityDeleted(): Observable<Capability[]> {
        return this.socketConnection.socket$.pipe(
            filter((val: WebSocketMessage<CapabilityDto[]>) => val.type == BaseSocketMessageType.Deleted),
            map((msg: WebSocketMessage<CapabilityDto[]>) => msg.body.map(dto => new Capability(dto))),
        );
    }

    onCapabilityChanged(): Observable<Capability[]> {
        return this.socketConnection.socket$.pipe(
            filter((val: WebSocketMessage<CapabilityDto[]>) => val.type == BaseSocketMessageType.Changed),
            map((msg: WebSocketMessage<CapabilityDto[]>) => msg.body.map(dto => new Capability(dto)))
        );
    }

    ngOnDestroy(): void {
        this.socketConnection.socket$.complete();
    }
}
