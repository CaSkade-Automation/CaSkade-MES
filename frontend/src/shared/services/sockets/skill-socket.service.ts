import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebSocketMessage, SkillSocketMessageType, StateChangeInfo } from '@shared/models/socket-communication/SocketData';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
import { SocketConnection } from './SocketConnection';
import { SkillDto } from '@shared/models/skill/Skill';


@Injectable({
    providedIn: 'root'
})
export class SkillSocketService  implements OnDestroy {

    private readonly WS_ENDPOINT = "ws://localhost:9091/skills";
    private socketConnection: SocketConnection<SkillDto[] | StateChangeInfo>;

    constructor() {
        this.socketConnection = new SocketConnection<SkillDto[] | StateChangeInfo>();
    }

    connect(): void {
        this.socketConnection.connect(this.WS_ENDPOINT);
    }

    onSkillAdded(): Observable<WebSocketMessage<SkillDto[]>> {
        return this.socketConnection.socket$.pipe(
            filter((msg: WebSocketMessage<SkillDto[]>) => msg.type == SkillSocketMessageType.Added));
    }

    onSkillDeleted(): Observable<WebSocketMessage<SkillDto[]>> {
        return this.socketConnection.socket$.pipe(
            filter((msg: WebSocketMessage<SkillDto[]>) => msg.type == SkillSocketMessageType.Deleted));
    }

    onSkillChanged(): Observable<WebSocketMessage<SkillDto[]>> {
        return this.socketConnection.socket$.pipe(
            filter((msg: WebSocketMessage<SkillDto[]>) => msg.type == SkillSocketMessageType.Changed));
    }

    onSkillStateChanged(skillIri?: string): Observable<StateChangeInfo> {
        // let subject = this.socketConnection.socket$.pipe();      // TODO: Should this be debounced?
        let subject = this.socketConnection.socket$.pipe();
        if(skillIri) {
            subject = subject.pipe(filter((msg: WebSocketMessage<StateChangeInfo>) =>
                (msg.body.skillIri == skillIri) && msg.type == SkillSocketMessageType.StateChanged));
        }
        return subject.pipe(map((msg: WebSocketMessage<StateChangeInfo>) => msg.body));
    }

    ngOnDestroy(): void {
        this.socketConnection.socket$.complete();
    }
}
