import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { CapabilityService } from 'src/shared/services/capability.service';
import { ModuleService } from 'src/shared/services/module.service';
import { SkillService } from 'src/shared/services/skill.service';
import { MessageService } from '../../../services/message.service';

@Component({
    selector: 'manual-registration',
    templateUrl: './manual-registration.component.html',
    styleUrls: ['./manual-registration.component.scss']
})
export class ManualRegistrationComponent {
    @Input() context: string
    ontologyString: string;

    constructor(
        private moduleService: ModuleService,
        private skillService: SkillService,
        private capabilityService: CapabilityService,
        private messageService: MessageService
    ) { }

    submit(): void {
        if(this.context=="production-modules"){
            try {
                this.moduleService.addModule(this.ontologyString);
                this.messageService.success("Resource manually registered", "Successfully registered a new resource");
            } catch (error) {
                this.messageService.warn("Error while manually registering resource", error);
            }
        }
        if(this.context=="skills") {
            this.skillService.addSkill(this.ontologyString).pipe(take(1)).subscribe({
                next: () => this.messageService.success("Skill manually registered", "Successfully registered a new skill"),
                error: (err) => this.messageService.danger("Failed to register skill", err),
            });
        }
        if(this.context == "capabilities") {
            this.capabilityService.addCapability(this.ontologyString).pipe(take(1)).subscribe({
                next: () => this.messageService.success("Capability manually registered", "Successfully registered a new capability"),
                error: (err) => this.messageService.danger("Failed to register capability", err.error.message),
            });
        }
    }

    clear(): void {
        this.ontologyString = "";
    }

}
