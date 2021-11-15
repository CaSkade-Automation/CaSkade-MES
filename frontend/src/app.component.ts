import { Component, OnInit } from '@angular/core';
import { ModuleSocketService } from './shared/services/sockets/module-socket.service';
import { SkillSocketService } from './shared/services/sockets/skill-socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        private skillSocket: SkillSocketService,
        private moduleSocket: ModuleSocketService
    ) {}

    ngOnInit(): void {
        this.skillSocket.connect();
        this.moduleSocket.connect();
    }
}
