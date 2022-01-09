import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BpmnProperty } from '../../../BpmnDataModel';
import { BpmnExtensionElementService } from '../../bpmn-extension-element.service';

@Component({
    selector: 'user-task-form',
    templateUrl: './user-task-form.component.html',
    styleUrls: ['./user-task-form.component.scss']
})
export class UserTaskFormComponent implements OnInit, OnChanges {

    @Input() bpmnElement;

    fg: FormGroup;

    constructor(
        private extensionService: BpmnExtensionElementService,
    ) { }

    ngOnInit(): void {
        this.fg = new FormGroup({
            assignee: new FormControl(this.bpmnElement?.businessObject.assignee),
            candidateUsers: new FormControl(this.bpmnElement?.businessObject.candidateUsers),
            candidateGroups: new FormControl(this.bpmnElement?.businessObject.candidateGroups),
        });


        this.fg.valueChanges.pipe(debounceTime(200)).subscribe(formValue => {
            for (const key in formValue) {
                this.setUserTaskProperty(key, formValue[key]);
            }
        });
    }

    setUserTaskProperty(key: string, value: string) {
        if (!value) return;
        const prop = new BpmnProperty(key, value);
        this.extensionService.updateBaseProperty(prop);
    }

    // OnChanges is needed to change form values when another UserTask is clicked as this doesn't trigger OnInit
    ngOnChanges(changes: SimpleChanges): void {
        this.assignee.setValue(this.bpmnElement.businessObject.assignee);
        this.candidateUsers.setValue(this.bpmnElement.businessObject.candidateUsers);
        this.candidateGroups.setValue(this.bpmnElement.businessObject.candidateGroupss);
    }

    get assignee(): FormControl {
        return this.fg?.controls.assignee as FormControl;
    }

    get candidateUsers(): FormControl {
        return this.fg?.controls.candidateUsers as FormControl;
    }

    get candidateGroups(): FormControl {
        return this.fg?.controls.candidateGroups as FormControl;
    }

}
