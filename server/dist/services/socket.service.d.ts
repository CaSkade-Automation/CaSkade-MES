export declare class SocketService {
    constructor(server: any);
    waitForConnection(): void;
    emitNewSelfDescription(selfDescription: any): void;
    emitModuleRegistrationEvent(message: any): void;
}
