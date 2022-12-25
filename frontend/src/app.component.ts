import { Component, OnInit } from '@angular/core';
import { CapabilitySocketService } from './shared/services/sockets/capability-socket.service';
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
        private moduleSocket: ModuleSocketService,
        private capabilitySocket: CapabilitySocketService,
    ) {}

    ngOnInit(): void {
        this.moduleSocket.connect();
        this.capabilitySocket.connect();
        this.skillSocket.connect();
    }
}
