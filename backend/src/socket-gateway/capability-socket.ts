import { Injectable } from '@nestjs/common';
import {OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway} from '@nestjs/websockets';
import { Websocket,} from './Websocket';
import { CapabilityDto } from '@shared/models/capability/Capability';
import { BaseSocketMessageType } from '@shared/models/socket-communication/SocketData';

@Injectable()
@WebSocketGateway(9091, {path: "/capabilities"})
export class CapabilitySocket extends Websocket implements OnGatewayConnection, OnGatewayDisconnect {

    /**
     * Sends a message that new capabilities have been added with the newly added capabilities as the body
     * @param newCapabilities The newly added capabilities
     */
    sendCapabilitiesAdded(newCapabilities: CapabilityDto[]): void {
        this.sendMessage(BaseSocketMessageType.Added, newCapabilities);
    }

    /**
     * Sends a message that a capability has been deleted with all current capabilities as the body
     * @param capabilities All currently registered capabilities after deleting
     */
    sendCapabilityDeleted(capabilities: CapabilityDto[]): void {
        this.sendMessage(BaseSocketMessageType.Deleted, capabilities);
    }
}
