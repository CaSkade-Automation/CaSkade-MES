import {OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway} from '@nestjs/websockets';
import { Websocket,} from './Websocket';

@WebSocketGateway({path: "capabilities"})
export class CapabilitySocket extends Websocket implements OnGatewayConnection, OnGatewayDisconnect {

}
