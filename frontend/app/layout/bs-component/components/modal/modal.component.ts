import { Component } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
    closeResult: string;
    constructor() { }

    open(content) {
    }

    private getDismissReason(reason: any): string {
        return  `with: ${reason}`;
    }
}
