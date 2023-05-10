import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketMessageType, WebSocketMessage } from '@shared/models/socket-communication/SocketData';
import { filter, map, tap } from 'rxjs/operators';
import { SocketConnection } from './SocketConnection';
import { SkillDto } from '@shared/models/skill/Skill';


@Injectable({
    providedIn: 'root'
})
export class SkillSocketService  implements OnDestroy {

    private readonly WS_ENDPOINT = "ws://localhost:9091/skills";

    constructor(
        private socketConnection: SocketConnection<SkillDto[]>
    ) {}

    connect(): void {
        this.socketConnection.connect(this.WS_ENDPOINT);
    }

    onSkillAdded(): Observable<WebSocketMessage<SkillDto[]>> {
        return this.socketConnection.socket$.pipe(filter((msg: WebSocketMessage<SkillDto[]>) => msg.type == SocketMessageType.Added));
    }

    onSkillDeleted(): Observable<WebSocketMessage<SkillDto[]>> {
        return this.socketConnection.socket$.pipe(filter((msg: WebSocketMessage<SkillDto[]>) => msg.type == SocketMessageType.Deleted));
    }

    onSkillChanged(): Observable<WebSocketMessage<SkillDto[]>> {
        return this.socketConnection.socket$.pipe(filter((msg: WebSocketMessage<SkillDto[]>) => msg.type == SocketMessageType.Changed));
    }

    onSkillStateChanged(skillIri: string): any {
        return this.socketConnection.socket$.pipe(tap(data => console.log(data)),
            filter(msg => (msg.body.some(skill => (skill.skillIri == skillIri)) && msg.type == SocketMessageType.Changed)),
            map(msg => msg.body));
    }

    ngOnDestroy(): void {
        this.socketConnection.socket$.complete();
    }
}
