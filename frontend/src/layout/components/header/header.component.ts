import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ArchivedMessage, MessageService } from '../../../shared/services/message.service';
import { GraphDbRepoService, DbConfig } from '../../../shared/services/graphDbRepoService.service';
import { Observable, map } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    messageArchive = new Array<ArchivedMessage>();
    public pushRightClass: string;
    graphDbHost$: Observable<string>

    constructor(
        private messageService: MessageService,
        private graphDbService: GraphDbRepoService,
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
        this.graphDbHost$ = this.graphDbService.getCurrentConfig().pipe(map(config => config.host));
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
