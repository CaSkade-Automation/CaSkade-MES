import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { BaseSocketMessageType, SkillSocketMessageType, StateChangeInfo } from "@shared/models/socket-communication/SocketData";
import { Websocket } from './Websocket';
import { Injectable } from '@nestjs/common';
import { SkillDto } from '@shared/models/skill/Skill';

@Injectable()
@WebSocketGateway(9091, {path: "/skills"})
export class SkillSocket extends Websocket implements OnGatewayConnection, OnGatewayDisconnect {

    /**
     * Sends a message that new skills have been added with the newly added skills as the body
     * @param newSkills The newly added skills
     */
    public sendSkillsAdded(newSkills: SkillDto[]): void {
        this.sendMessage(BaseSocketMessageType.Added, newSkills);
    }


    /**
    * Sends a message that a skill has been deleted with all current skills as the body
    * @param skills All currently registered skills after deleting
    */
    public sendSkillDeleted(skills: SkillDto[]): void {
        this.sendMessage(BaseSocketMessageType.Deleted, skills);
    }


    /**
     * Sends a message that the state of a skill has changed
     * @param skillIri IRI of the skill
     * @param newStateTypeIri IRI of the updated state's type
     */
    public sendStateChanged(skillIri: string, newStateTypeIri: string): void {
        const stateChangedMessage: StateChangeInfo = {
            newStateTypeIri: newStateTypeIri,
            skillIri: skillIri
        };
        this.sendMessage(SkillSocketMessageType.StateChanged, stateChangedMessage);
    }

}
