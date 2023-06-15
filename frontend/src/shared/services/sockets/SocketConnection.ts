import { catchError, EMPTY, tap } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { WebSocketMessage } from "@shared/models/socket-communication/SocketData";
import { Injectable } from "@angular/core";

// @Injectable({
//     providedIn: 'root'
// })
export class SocketConnection<T> {

    private _socket$: WebSocketSubject<WebSocketMessage<T>>;

    public connect(websocketEndpoint: string): void {
        console.log("connecting for endpoint" + websocketEndpoint);

        if (!this._socket$ || this._socket$.closed) {
            this._socket$ = this.createNewWebSocket<T>(websocketEndpoint);
            this._socket$.pipe(
                tap({
                    error: error => console.log(error),
                }), catchError(_ => EMPTY));
        }
    }

    private createNewWebSocket<T>(websocketEndpoint: string): WebSocketSubject<WebSocketMessage<T>> {
        return webSocket<WebSocketMessage<T>>(websocketEndpoint);
    }

    public get socket$(): WebSocketSubject<WebSocketMessage<T>> {
        return this._socket$;
    }

}
