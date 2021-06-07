import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../shared/services/message.service';

@Component({
    selector: 'message-container',
    templateUrl: './message-container.component.html',
    styleUrls: ['./message-container.component.scss']
})
export class MessageContainerComponent implements OnInit {
    message="";
    messageList= new Array<Message>()

    constructor(private messageService: MessageService ) {  }

    ngOnInit(): void {
        this.showAllMessages();
    }


    showAllMessages(): void{
        this.messageService.getAllMessages().subscribe(
            (messagelist) => {
                this.messageList = messagelist;},
            (err) => console.log(`Error during display of Message List. Error: ${err}`),
            null
        );
    }
}

export class Message{
    constructor(public title: string, public textbody: string, public type: MessageType) {}
}

export enum MessageType {
    Success = "alert-success",
    Danger = "alert-danger",
    Warning = "alert-warning",
    Info = "alert-info"
}
