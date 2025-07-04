import { Injectable } from '@angular/core';
import { MessageService } from './message.service';

@Injectable({
    providedIn: 'root'
})
export class ClipboardService {

    constructor(
        private messageService: MessageService,
    ) { }

    async copyTextToClipboard(text: string): Promise<boolean> {
        if (!navigator.clipboard) {
            this.messageService.warn('Clipboard error', 'Clipboard API not available');
            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            this.messageService.warn('Clipboard error', `Error while copying to the clipboard: ${err}`);
            return false;
        }
    }
}
