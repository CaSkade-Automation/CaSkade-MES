import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BpmnProperty } from '../../../BpmnDataModel';
import { BpmnExtensionElementService } from '../../bpmn-extension-element.service';

@Component({
    selector: 'flow-form',
    templateUrl: './flow-form.component.html',
    styleUrls: ['./flow-form.component.scss']
})
export class FlowFormComponent implements OnInit {

    @Input() bpmnElement;
    @Output() basePropertyUpdated = new EventEmitter<BpmnProperty>();
    fg: FormGroup;

    constructor(
        private extensionService: BpmnExtensionElementService
    ) {}


    ngOnInit(): void {
        const existingCondition = this.extensionService.getFlowCondition();
        this.fg = new FormGroup({
            condition: new FormControl(existingCondition),
        });

        this.condition.valueChanges.pipe(debounceTime(100)).subscribe(condition => {
            const expression = "${"+condition+"}";
            const prop = new BpmnProperty("condition", expression);
            this.extensionService.addFlowCondition(expression);
            // this.basePropertyUpdated.emit(prop);
        });
    }

    get condition(): FormControl {
        return this.fg.controls.condition as FormControl;
    }

}
