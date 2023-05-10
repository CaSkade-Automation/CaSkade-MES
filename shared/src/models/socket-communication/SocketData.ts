export enum SocketMessageType {
    Added = "added",
    Changed = "changed",
    Deleted = "deleted",
}

export interface StateChangeInfo {
    skillIri: string,
    newStateTypeIri: string
}

export class WebSocketMessage<T> {
    constructor(public type: SocketMessageType, public body: T) {}
}
