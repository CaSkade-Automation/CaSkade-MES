import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message-container/message-list';
import { MessageService } from '../../../shared/services/message.service';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent {

 @Input() message: Message

  
}
