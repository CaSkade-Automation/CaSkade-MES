import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { BaseSocketMessageType, SkillSocketMessageType, StateChangeInfo } from "@shared/models/socket-communication/SocketData";
import { Websocket } from './Websocket';
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
        this.sendMessage(SkillSocketMessageType.StateChanged, stateChangedMessage);
    }

}
