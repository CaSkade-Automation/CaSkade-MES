import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BpmnProperty } from '../../../BpmnDataModel';
import { BpmnExtensionElementService, CamundaOutputParameter } from '../../bpmn-extension-element.service';
import { BpmnModelService } from '../../bpmn-model.service';

@Component({
    selector: 'flow-form',
    templateUrl: './flow-form.component.html',
    styleUrls: ['./flow-form.component.scss']
})
export class FlowFormComponent implements OnInit {

    @Input() bpmnElement;
    fg: FormGroup<{
        condition: FormControl<string>;
    }>;
    existingOutputs: Array<CamundaOutputParameter>

    constructor(
        private extensionService: BpmnExtensionElementService,
        private modelService: BpmnModelService
    ) {}

    ngOnInit(): void {
        const existingCondition = this.extensionService.getFlowCondition();
        this.fg = new FormGroup({
            condition: new FormControl(existingCondition),
        });

        this.condition.valueChanges.pipe(debounceTime(100)).subscribe(condition => {

            const expression = "${"+condition+"}";
            console.log(expression);

            const prop = new BpmnProperty("condition", expression);
            this.extensionService.addFlowCondition(expression);
        });
    }

    keypressed(event: any){
        if(event.code === "Space" && event.ctrlKey) {
            this.existingOutputs = this.modelService.getAllOutputs();
            console.log(this.existingOutputs);

        }
    }

    get condition(): FormControl {
        return this.fg.controls.condition as FormControl;
    }

}
