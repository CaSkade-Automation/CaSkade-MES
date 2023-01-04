import { Component, OnInit } from '@angular/core';
import { ArchivedMessage, MessageService } from '../../../../shared/services/message.service';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

    archiveEntries: Array<ArchivedMessage>;

    constructor(
        private messageService: MessageService) {

    }

    ngOnInit() {
        this.archiveEntries = this.messageService.getMessageArchive(7);
    }
}
