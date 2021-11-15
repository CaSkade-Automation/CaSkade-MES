import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { SocketMessageType, StateChangeInfo } from "@shared/socket-communication/SocketData";
import { Websocket } from './Websocket';
import { Server } from "ws";
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway(9091, {path: "/skills"})
export class SkillSocket extends Websocket implements OnGatewayConnection, OnGatewayDisconnect {


    /**
     * Sends a message that the state of a skill has changed
     * @param skillIri IRI of the skill
     * @param newStateTypeIri IRI of the updated state's type
     */
    sendStateChanged(skillIri: string, newStateTypeIri: string): void {
        const stateChangedMessage: StateChangeInfo = {
            newStateTypeIri: newStateTypeIri,
            skillIri: skillIri
        };
        this.sendMessage(SocketMessageType.Changed, stateChangedMessage);
    }

}
