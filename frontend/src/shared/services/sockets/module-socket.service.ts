import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BaseSocketMessageType, WebSocketMessage } from '@shared/models/socket-communication/SocketData';
import { SocketConnection } from './SocketConnection';
import { ProductionModuleDto} from '@shared/models/production-module/ProductionModule';
import { ProductionModule } from '../../models/ProductionModule';

@Injectable({
    providedIn: 'root'
})
export class ModuleSocketService {

    private readonly WS_ENDPOINT = "ws://localhost:9091/modules";
    private socketConnection: SocketConnection<ProductionModuleDto[]>;

    constructor() {
        this.socketConnection = new SocketConnection<ProductionModuleDto[]>();
    }

    connect(): void {
        this.socketConnection.connect(this.WS_ENDPOINT);
    }

    onModulesAdded(): Observable<ProductionModule[]> {
        return this.socketConnection.socket$.pipe(
            filter((msg: WebSocketMessage<ProductionModuleDto[]>) => msg.type == BaseSocketMessageType.Added),
            map((msg: WebSocketMessage<ProductionModuleDto[]>) => msg.body.map(dto => new ProductionModule(dto))),
        );
    }

    onModulesChanged(): Observable<ProductionModule[]> {
        return this.socketConnection.socket$.pipe(
            filter((msg: WebSocketMessage<ProductionModuleDto[]>) => msg.type == BaseSocketMessageType.Changed),
            map((msg: WebSocketMessage<ProductionModuleDto[]>) => msg.body.map(dto => new ProductionModule(dto))),
        );
    }

    onModuleDeleted(): Observable<ProductionModule[]> {
        return this.socketConnection.socket$.pipe(
            filter((msg: WebSocketMessage<ProductionModuleDto[]>) => msg.type == BaseSocketMessageType.Deleted),
            map((msg: WebSocketMessage<ProductionModuleDto[]>) => msg.body.map(dto => new ProductionModule(dto))),
        );
    }

    ngOnDestroy(): void {
        this.socketConnection.socket$.complete();
    }
}
