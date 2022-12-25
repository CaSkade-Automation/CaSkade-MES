import { Injectable } from '@nestjs/common';
import {OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway} from '@nestjs/websockets';
import { Websocket,} from './Websocket';

@Injectable()
@WebSocketGateway(9091, {path: "/capabilities"})
export class CapabilitySocket extends Websocket implements OnGatewayConnection, OnGatewayDisconnect {

}
