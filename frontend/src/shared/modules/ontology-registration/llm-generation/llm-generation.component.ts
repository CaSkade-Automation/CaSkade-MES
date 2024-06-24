import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { CapabilityService } from 'src/shared/services/capability.service';
import { ModuleService } from 'src/shared/services/module.service';
import { SkillService } from 'src/shared/services/skill.service';
import { MessageService } from '../../../services/message.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'llm-generation',
    templateUrl: './llm-generation.component.html',
    styleUrls: ['./llm-generation.component.scss']
})
export class LlmGenerationComponent {
    @Input() context: string

    models = new Array<string>("asd", "asd");
    form = this.fb.group({
        model: this.fb.control(this.models[0], Validators.required),
        taskDescription: this.fb.control("", Validators.required)
    })

    constructor(
        private messageService: MessageService,
        private capabilityService: CapabilityService,
        private fb: FormBuilder
    ) { }

    submit(): void {
        if(this.context=="production-modules"){
            this.messageService.warn("Not available", "LLM Generation can currently only be used to generate capabilities.");
        }
        if(this.context=="skills") {
            this.messageService.warn("Not available", "LLM Generation can currently only be used to generate capabilities.");
        }
        if(this.context == "capabilities") {
            this.messageService.success("Works", "it works");
            // this.capabilityService.addCapability(this.ontologyString).pipe(take(1)).subscribe(
            //     () => this.ontologyString="Ontology registered"
            // );
        }
    }

    clearInput(): void{
        this.form.controls.taskDescription.reset();
    }

}
