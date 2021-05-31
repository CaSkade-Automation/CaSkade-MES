import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { SocketService } from "./socket.service";
import { SocketEventName } from '@shared/socket-communication/SocketEventName';

export class Message{
    constructor(public title: string, public textbody: string) {}
}
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
                () => this.addAndDeleteMessage("Module","Module added"),
                (err) => this.message=`Error during Module registration. Error: ${err}`
            ),
            // Moduled change
            this.socketService.getMessage(SocketEventName.ProductionModules_Changed).subscribe(
                () => this.addAndDeleteMessage("Module","Module changed"),
                (err) => this.message=`Error during Module changing. Error: ${err}`,
            ),
            // Modules delete
            this.socketService.getMessage(SocketEventName.ProductionModules_Deleted).subscribe(
                () => this.addAndDeleteMessage("Module","Module deleted"),
                (err) => this.message=`Error during Module deletion. Error: ${err}`
            ),
            //Skills  add
            this.socketService.getMessage(SocketEventName.Skills_Added).subscribe(
                () => this.addAndDeleteMessage("Skill","Skill added"),
                (err) => this.message=`Error during Skill registration. Error: ${err}`
            ),
            // Skills change
            this.socketService.getMessage(SocketEventName.Skills_StateChanged).subscribe(
                () => this.addAndDeleteMessage("Skill","Skill State changed"),
                (err) => this.message=`Error during state change of a skill changing. Error: ${err}`
            ),
            // Skills delete
            this.socketService.getMessage(SocketEventName.Skills_Deleted).subscribe(
                () => this.addAndDeleteMessage("Skill","Skill deleted"),
                (err) => this.message=`Error during Skill deletion. Error: ${err}`
            ),
            //Capabilities  add
            this.socketService.getMessage(SocketEventName.Capabilities_Added).subscribe(
                () =>  this.addAndDeleteMessage("Capability","Capability added"),
                (err) => this.message=`Error during Capability registration. Error: ${err}`
            ),
            // Capabilities change
            this.socketService.getMessage(SocketEventName.Capabilities_Changed).subscribe(
                () =>  this.addAndDeleteMessage("Capability","Capability changed"),
                (err) => this.message=`Error during Capability changing. Error: ${err}`
            ),
            // Capabilities delete
            this.socketService.getMessage(SocketEventName.Capabilities_Deleted).subscribe(
                () => this.addAndDeleteMessage("Capability","Capability deleted"),
                (err) => this.message=`Error during Capability deletion. Error: ${err}`
            );
            this.observer.next(this.messagelist);
        });
        return obs;
    }

    private addAndDeleteMessage(title: string, textbody: string): void{
        {this.messagelist.push(new Message(title, textbody));
            this.observer.next(this.messagelist);
            setTimeout(() => {this.messagelist.splice(0,1);
                this.observer.next(this.messagelist);},2000);
        }
    }
}
