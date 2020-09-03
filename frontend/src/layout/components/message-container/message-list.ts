import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/shared/services/socket.service';
import { SocketEventName } from '@shared/socket-communication/SocketEventName';
import { MessageService } from '../../../shared/services/message.service';

@Component({
    selector: 'app-registration-message',
    templateUrl: './registration-message.component.html',
    styleUrls: ['./registration-message.component.scss']
})
export class MessageList implements OnInit {
  message="";
  messageList= new Array<Message>()

  constructor(private messageService: MessageService ) {  }
  ngOnInit(): void {
      this.showAllMessages();
  }
  showAllMessages(){
      this.messageService.getAllMessages().subscribe(
          (messagelist) => { console.log(messagelist);
              this.messageList = messagelist;},
          (err) => console.log("Error during display of Message List"),
          null
      );
  }
}
export class Message{
    constructor(public title: string, public textbody: string) {} 
}