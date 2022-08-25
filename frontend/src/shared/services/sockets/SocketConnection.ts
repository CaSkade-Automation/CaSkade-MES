import { catchError, EMPTY, tap } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { WebSocketMessage } from "@shared/models/socket-communication/SocketData";

export class SocketConnection {

    protected socket$: WebSocketSubject<WebSocketMessage>;
    protected WS_ENDPOINT;

    public connect(): void {
        if (!this.socket$ || this.socket$.closed) {
            this.socket$ = this.getNewWebSocket();
            this.socket$.pipe(
                tap({
                    error: error => console.log(error),
                }), catchError(_ => EMPTY));
        }
    }

    private getNewWebSocket(): WebSocketSubject<WebSocketMessage> {
        return webSocket(this.WS_ENDPOINT);
    }

}
