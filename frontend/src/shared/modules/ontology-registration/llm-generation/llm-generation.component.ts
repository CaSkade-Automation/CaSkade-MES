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
            const {model, taskDescription} = this.form.value;
            this.messageService.info("Generation started", "Started generating a capability from your description. Depending on the complexity, this may take a while");
            this.llmGeneration.generateCapability(taskDescription, model).subscribe(data => {
                this.messageService.success("Generated capability", "Successfully generated a new capability from plain text");
            });
        }
    }

    clearInput(): void{
        this.form.controls.taskDescription.reset();
    }

}
