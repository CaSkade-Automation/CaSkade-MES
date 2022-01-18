import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketMessageType } from '@shared/socket-communication/SocketData';
import { WebSocketMessage } from '@shared/socket-communication/SocketData';
import { filter, map } from 'rxjs/operators';
import { SocketConnection } from './SocketConnection';


@Injectable({
    providedIn: 'root'
})
export class SkillSocketService extends SocketConnection  implements OnDestroy {
    WS_ENDPOINT = "ws://localhost:9091/skills";
    messagesSubject$ = new Subject();

    getSkillAdded(): Observable<WebSocketMessage> {
        return this.socket$.pipe(filter((val: WebSocketMessage) => val.type == SocketMessageType.Added));
    }

    getSkillDeleted(): Observable<WebSocketMessage> {
        return this.socket$.pipe(filter((val: WebSocketMessage) => val.type == SocketMessageType.Deleted));
    }

    getSkillChanged(): Observable<WebSocketMessage> {
        return this.socket$.pipe(filter((val: WebSocketMessage) => val.type == SocketMessageType.Changed));
    }

    getStateChangesOfSkill(skillIri: string): any {
        return this.socket$.pipe(
            filter(val => (val.body.skillIri ==skillIri && val.type == SocketMessageType.Changed)),
            map(val => val.body));
    }

    ngOnDestroy(): void {
        this.socket$.complete();
    }
}
