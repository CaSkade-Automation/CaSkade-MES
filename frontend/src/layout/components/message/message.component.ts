import { Component, Input } from '@angular/core';
import { Message } from '../message-container/message-container.component';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})

/**
 * This is just a very simple component to show a message.
 */
export class MessageComponent {

 @Input() message: Message


}
