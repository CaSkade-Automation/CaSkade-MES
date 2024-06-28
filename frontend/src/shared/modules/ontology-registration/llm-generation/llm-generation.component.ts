import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LlmGenerationService } from '../../../services/llm-generation.service';

@Component({
    selector: 'llm-generation',
    templateUrl: './llm-generation.component.html',
    styleUrls: ['./llm-generation.component.scss']
})
export class LlmGenerationComponent implements OnInit {
    @Input() context: string

    models = new Array<string>();
    form = this.fb.group({
        model: this.fb.control(this.models[0], Validators.required),
        taskDescription: this.fb.control("", Validators.required)
    })

    constructor(
        private messageService: MessageService,
        private llmGeneration: LlmGenerationService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.llmGeneration.getModels().subscribe(models => {
            this.models = models;
        });
    }

    submit(): void {
        if(this.context=="production-modules"){
            this.messageService.warn("Not available", "LLM Generation can currently only be used to generate capabilities.");
        }
        if(this.context=="skills") {
            this.messageService.warn("Not available", "LLM Generation can currently only be used to generate capabilities.");
        }
        if(this.context == "capabilities") {
            this.messageService.success("Works", "it works");
            const {model, taskDescription} = this.form.value;
            console.log(model, taskDescription);

            this.llmGeneration.generateCapability(taskDescription, model).subscribe(data => console.log(data));

            // this.capabilityService.addCapability(this.ontologyString).pipe(take(1)).subscribe(
            //     () => this.ontologyString="Ontology registered"
            // );
        }
    }

    clearInput(): void{
        this.form.controls.taskDescription.reset();
    }

}
