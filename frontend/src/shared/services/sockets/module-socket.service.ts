import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SocketMessageType, WebSocketMessage } from '@shared/models/socket-communication/SocketData';
import { SocketConnection } from './SocketConnection';
import { ProductionModuleDto} from '@shared/models/production-module/ProductionModule';

@Injectable({
    providedIn: 'root'
})
export class ModuleSocketService {

    private readonly WS_ENDPOINT = "ws://localhost:9091/modules";

    constructor(
        private socketConnection: SocketConnection<ProductionModuleDto[]>
    ) {}

    connect(): void {
        this.socketConnection.connect(this.WS_ENDPOINT);
    }

    getModulesAdded(): Observable<WebSocketMessage<ProductionModuleDto[]>> {
        return this.socketConnection.socket$.pipe(
            filter((val: WebSocketMessage<ProductionModuleDto[]>) => val.type == SocketMessageType.Added));
    }

    getModulesChanged(): Observable<WebSocketMessage<ProductionModuleDto[]>> {
        return this.socketConnection.socket$.pipe(
            filter((val: WebSocketMessage<ProductionModuleDto[]>) => val.type == SocketMessageType.Changed));
    }

    getModulesDeleted(): Observable<WebSocketMessage<ProductionModuleDto[]>> {
        return this.socketConnection.socket$.pipe(
            filter((val: WebSocketMessage<ProductionModuleDto[]>) => val.type == SocketMessageType.Deleted));
    }

    ngOnDestroy(): void {
        this.socketConnection.socket$.complete();
    }
}
