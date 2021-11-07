import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BpmnProperty } from '../../../BpmnDataModel';

@Component({
    selector: 'user-task-form',
    templateUrl: './user-task-form.component.html',
    styleUrls: ['./user-task-form.component.scss']
})
export class UserTaskFormComponent implements OnInit {

    @Input() bpmnElement;
    @Output() basePropertyUpdated = new EventEmitter<BpmnProperty>();

    fg: FormGroup;

    ngOnInit(): void {
        this.fg = new FormGroup({
            assignee: new FormControl(this.bpmnElement?.assignee),
        });

        this.assignee.valueChanges.subscribe(assignee => {
            const prop = new BpmnProperty("camunda:assignee", assignee);
            this.basePropertyUpdated.emit(prop);
        });
    }

    get assignee(): FormControl {
        return this.fg.controls.assignee as FormControl;
    }

}
