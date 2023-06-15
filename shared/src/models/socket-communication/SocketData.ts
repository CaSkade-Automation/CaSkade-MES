export enum BaseSocketMessageType {
    Added = "added",
    Changed = "changed",
    Deleted = "deleted",
}

export enum SkillSocketMessageType {
    StateChanged = "StateChanged",
    Added = "added",
    Changed = "changed",
    Deleted = "deleted",
}

export type CapabilitySocketMessageType = BaseSocketMessageType
export type ModuleSocketMessageType = BaseSocketMessageType

export type SocketMessageType = SkillSocketMessageType | CapabilitySocketMessageType | ModuleSocketMessageType


export interface StateChangeInfo {
    skillIri: string,
    newStateTypeIri: string
}

export class WebSocketMessage<T> {
    constructor(public type: SocketMessageType, public body: T) {}
}
