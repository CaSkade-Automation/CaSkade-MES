import { Injectable } from '@nestjs/common';
import { WebSocketGateway} from '@nestjs/websockets';
import { Websocket } from './Websocket';
import { ProductionModuleDto } from '@shared/models/production-module/ProductionModule';
import { BaseSocketMessageType } from '@shared/models/socket-communication/SocketData';

@Injectable()
@WebSocketGateway(9091, {path: "/modules"})
export class ModuleSocket extends Websocket{

    /**
     * Sends a message that new modules have been added with the newly added modules as the body
     * @param newModules The newly added modules
     */
    sendModulesAdded(newModules: ProductionModuleDto[]): void {
        this.sendMessage(BaseSocketMessageType.Added, newModules);
    }

    /**
     * Sends a message that a module has been deleted with the current modules as the body
     * @param modules All currently registered modules after deleting
     */
    sendModuleDeleted(modules: ProductionModuleDto[]): void {
        this.sendMessage(BaseSocketMessageType.Deleted, modules);
    }
}
