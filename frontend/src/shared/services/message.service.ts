import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { SocketService } from "./socket.service";
import { SocketEventName } from '@shared/socket-communication/SocketEventName';
import { Message, MessageType } from "src/layout/components/message-container/message-container.component";


@Injectable({
    providedIn: 'root'
})
export class MessageService {

    message="";
    messagelist= new Array<Message>()
    observer: Observer<Message[]>;

    constructor(private socketService: SocketService) {}
    getAllMessages(): Observable<Message[]>{
        const obs= new Observable<Message[]>(observer => {
            this.observer = observer;

            //Modules  add
            this.socketService.getMessage(SocketEventName.ProductionModules_Added).subscribe(
                () => this.addAndDeleteMessage(new Message("Module","Module added", MessageType.Success)),
                (err) => this.message=`Error during Module registration. Error: ${err}`
            ),
            // Moduled change
            this.socketService.getMessage(SocketEventName.ProductionModules_Changed).subscribe(
                () => this.addAndDeleteMessage(new Message("Module","Module changed", MessageType.Info)),
                (err) => this.message=`Error during Module changing. Error: ${err}`,
            ),
            // Modules delete
            this.socketService.getMessage(SocketEventName.ProductionModules_Deleted).subscribe(
                () => this.addAndDeleteMessage(new Message("Module","Module deleted", MessageType.Info)),
                (err) => this.message=`Error during Module deletion. Error: ${err}`
            ),
            //Skills  add
            this.socketService.getMessage(SocketEventName.Skills_Added).subscribe(
                () => this.addAndDeleteMessage(new Message("Skill","Skill added", MessageType.Success)),
                (err) => this.message=`Error during Skill registration. Error: ${err}`
            ),
            // Skills change
            this.socketService.getMessage(SocketEventName.Skills_StateChanged).subscribe(
                () => this.addAndDeleteMessage(new Message("Skill","Skill State changed", MessageType.Info)),
                (err) => this.message=`Error during state change of a skill changing. Error: ${err}`
            ),
            // Skills delete
            this.socketService.getMessage(SocketEventName.Skills_Deleted).subscribe(
                () => this.addAndDeleteMessage(new Message("Skill","Skill deleted", MessageType.Info)),
                (err) => this.message=`Error during Skill deletion. Error: ${err}`
            ),
            //Capabilities  add
            this.socketService.getMessage(SocketEventName.Capabilities_Added).subscribe(
                () =>  this.addAndDeleteMessage(new Message("Capability","Capability added", MessageType.Success)),
                (err) => this.message=`Error during Capability registration. Error: ${err}`
            ),
            // Capabilities change
            this.socketService.getMessage(SocketEventName.Capabilities_Changed).subscribe(
                () =>  this.addAndDeleteMessage(new Message("Capability","Capability changed", MessageType.Info)),
                (err) => this.message=`Error during Capability changing. Error: ${err}`
            ),
            // Capabilities delete
            this.socketService.getMessage(SocketEventName.Capabilities_Deleted).subscribe(
                () => this.addAndDeleteMessage(new Message("Capability","Capability deleted", MessageType.Info)),
                (err) => this.message=`Error during Capability deletion. Error: ${err}`
            );
            this.observer.next(this.messagelist);
        });
        return obs;
    }


    /**
     * Displays a new success message
     * @param messageTitle Title of the message
     * @param messageBody Body of the message
     */
    public success(messageTitle: string, messageBody: string): void {
        const message = new Message(messageTitle, messageBody, MessageType.Success);
        this.addAndDeleteMessage(message);
    }


    /**
     * Displays a new info message
     * @param messageTitle Title of the message
     * @param messageBody Body of the message
     */
    public info(messageTitle: string, messageBody: string): void {
        const message = new Message(messageTitle, messageBody, MessageType.Info);
        this.addAndDeleteMessage(message);
    }


    /**
     * Displays a new danger message
     * @param messageTitle Title of the message
     * @param messageBody Body of the message
     */
    public danger(messageTitle: string, messageBody: string): void {
        const message = new Message(messageTitle, messageBody, MessageType.Danger);
        this.addAndDeleteMessage(message);
    }


    /**
     * Displays a new warning message
     * @param messageTitle Title of the message
     * @param messageBody Body of the message
     */
    public warn(messageTitle: string, messageBody: string): void {
        const message = new Message(messageTitle, messageBody, MessageType.Warning);
        this.addAndDeleteMessage(message);
    }


    private addAndDeleteMessage(message: Message): void{
        // Add a new message to the list and emit to observer
        this.messagelist.push(message);
        this.observer.next(this.messagelist);

        // Wait 2 seconsd and remove it from the list
        setTimeout(() => {
            this.messagelist.splice(0,1);
            this.observer.next(this.messagelist);
        },2000);

    }
}
