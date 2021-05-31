import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../shared/services/message.service';

@Component({
    selector: 'message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.scss']
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
            (messagelist) => { console.log(messagelist);
                this.messageList = messagelist;},
            (err) => console.log(`Error during display of Message List. Error: ${err}`),
            null
        );
    }
}

export class Message{
    constructor(public title: string, public textbody: string) {}
}
