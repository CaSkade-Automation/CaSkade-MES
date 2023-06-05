import { Injectable } from '@nestjs/common';
import { WebSocketGateway} from '@nestjs/websockets';
import { Websocket } from './Websocket';

@Injectable()
@WebSocketGateway(9091, {path: "/modules"})
export class ModuleSocket extends Websocket{

}
