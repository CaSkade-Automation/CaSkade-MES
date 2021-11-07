import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BpmnProperty } from '../../../BpmnDataModel';

@Component({
    selector: 'user-task-form',
    templateUrl: './user-task-form.component.html',
    styleUrls: ['./user-task-form.component.scss']
})
export class UserTaskFormComponent implements OnInit, OnChanges {

    @Input() bpmnElement;
    @Output() basePropertyUpdated = new EventEmitter<BpmnProperty>();

    fg: FormGroup;

    ngOnInit(): void {
        this.fg = new FormGroup({
            assignee: new FormControl(this.bpmnElement?.businessObject.assignee),
        });

        this.assignee?.valueChanges.subscribe(assignee => {
            const prop = new BpmnProperty("assignee", assignee);
            this.basePropertyUpdated.emit(prop);
        });
    }

    // OnChanges is needed to change form values when another UserTask is clicked as this doesn't trigger OnInit
    ngOnChanges(changes: SimpleChanges): void {
        this.assignee?.setValue(this.bpmnElement.businessObject.assignee);
    }

    get assignee(): FormControl {
        return this.fg?.controls.assignee as FormControl;
    }

}
