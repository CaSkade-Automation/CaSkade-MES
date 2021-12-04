import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ArchivedMessage, MessageService } from '../../../shared/services/message.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    messageArchive = new Array<ArchivedMessage>();
    public pushRightClass: string;

    constructor(
        private messageService: MessageService,
        public router: Router,
    ) {

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit(): void {
        this.pushRightClass = 'push-right';
    }

    reloadMessageArchive() {
        this.messageArchive = this.messageService.getMessageArchive();
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar(): void {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr(): void {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout(): void {
        localStorage.removeItem('isLoggedin');
    }
}
