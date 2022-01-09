import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { Message, MessageType } from "src/layout/components/message-container/message-container.component";
import { ModuleSocketService } from "./sockets/module-socket.service";
import { SkillSocketService } from "./sockets/skill-socket.service";


export class ArchivedMessage {
    constructor(public message: Message, public date: Date) {}
}

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    messageDisplay= new Array<Message>()

    observer: Observer<Message[]>;

    constructor(
        private moduleSocket: ModuleSocketService,
        private skillSocket: SkillSocketService,
        // private capabilitySocket: CapabilitySocket
    ) {}

    getAllMessages(): Observable<Message[]>{
        const obs= new Observable<Message[]>(observer => {
            this.observer = observer;

            //Modules  add
            this.moduleSocket.getModulesAdded().subscribe({
                next: (val) => this.addAndDeleteMessage(new Message("New Module","Module added", MessageType.Success)),
                error: (err) => this.addAndDeleteMessage(new Message("Error during Module registration",`Error: ${err}`, MessageType.Danger)),
            });
            // Moduled change
            this.moduleSocket.getModulesChanged().subscribe({
                next: (val) => this.addAndDeleteMessage(new Message("Module","Module updated", MessageType.Info)),
                error: (err) => this.addAndDeleteMessage(new Message("Error during Module update",`Error: ${err}`, MessageType.Danger)),
            }),
            // Modules delete
            this.moduleSocket.getModulesDeleted().subscribe({
                next: (val) => this.addAndDeleteMessage(new Message("Module","Module deleted", MessageType.Info)),
                error: (err) => this.addAndDeleteMessage(new Message("Error during Module deletion",`Error: ${err}`, MessageType.Danger)),
            }),
            // Skill added
            this.skillSocket.getSkillAdded().subscribe({
                next: (val) => this.addAndDeleteMessage(new Message("New Skill","Skill added", MessageType.Success)),
                error: (err) => this.addAndDeleteMessage(new Message("Error during Skill registration",`Error: ${err}`, MessageType.Danger)),
            });
            // Skill changed
            this.skillSocket.getSkillChanged().subscribe({
                next: (val) => this.addAndDeleteMessage(new Message("Skill","Skill changed", MessageType.Info)),
                error: (err) => this.addAndDeleteMessage(new Message("Error during Skill deletion",`Error: ${err}`, MessageType.Danger)),
            }),
            // Skill deleted
            this.skillSocket.getSkillDeleted().subscribe({
                next: (val) => this.addAndDeleteMessage(new Message("Skill","Skill deleted", MessageType.Info)),
                error: (err) => this.addAndDeleteMessage(new Message("Error during Skill deletion",`Error: ${err}`, MessageType.Danger)),
            }),

            // //Capabilities  add
            // this.socketService.getMessage(SocketEventName.Capabilities_Added).subscribe(
            //     () =>  this.addAndDeleteMessage(new Message("Capability","Capability added", MessageType.Success)),
            //     (err) => this.message=`Error during Capability registration. Error: ${err}`
            // ),
            // // Capabilities change
            // this.socketService.getMessage(SocketEventName.Capabilities_Changed).subscribe(
            //     () =>  this.addAndDeleteMessage(new Message("Capability","Capability changed", MessageType.Info)),
            //     (err) => this.message=`Error during Capability changing. Error: ${err}`
            // ),
            // // Capabilities delete
            // this.socketService.getMessage(SocketEventName.Capabilities_Deleted).subscribe(
            //     () => this.addAndDeleteMessage(new Message("Capability","Capability deleted", MessageType.Info)),
            //     (err) => this.message=`Error during Capability deletion. Error: ${err}`
            // );
            this.observer.next(this.messageDisplay);
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
        this.messageDisplay.push(message);
        this.addToArchive(message);
        this.observer.next(this.messageDisplay);

        // Wait 2 seconsd and remove it from the list
        setTimeout(() => {
            this.messageDisplay.splice(0,1);
            this.observer.next(this.messageDisplay);
        },2000);
    }

    private addToArchive(message: Message): void {
        const messageArchive = new Array<ArchivedMessage>();
        const existingArchive = JSON.parse(localStorage.getItem("messageArchive")) as Array<ArchivedMessage>;
        if(existingArchive) {
            messageArchive.push(...existingArchive);
        }
        const currentDate = new Date();
        if(messageArchive.length >= 10) {
            messageArchive.shift();
        }
        messageArchive.push(new ArchivedMessage(message, currentDate));
        localStorage.setItem("messageArchive", JSON.stringify(messageArchive));
    }

    public getMessageArchive(): Array<ArchivedMessage> {
        return JSON.parse(localStorage.getItem("messageArchive")) as Array<ArchivedMessage>;
    }
}

