import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { BpmnElement, BpmnProperty } from '../../../BpmnDataModel';
import { BpmnExtensionElementService } from '../../bpmn-extension-element.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'user-task-form',
    templateUrl: './user-task-form.component.html',
    styleUrls: ['./user-task-form.component.scss']
})
export class UserTaskFormComponent implements OnInit {

    @Input() bpmnElement$: Observable<BpmnElement>;

    fg: FormGroup<{
        assignee: FormControl<string>;
        candidateUsers: FormControl<string>;
        candidateGroups: FormControl<string>;
    }>;

    constructor(
        private extensionService: BpmnExtensionElementService,
    ) { }

    ngOnInit(): void {
        this.bpmnElement$.pipe(filter(bpmnElement => bpmnElement.type == "bpmn:UserTask")).subscribe(bpmnElement => {
            this.fg = new FormGroup({
                assignee: new FormControl(bpmnElement?.businessObject.assignee),
                candidateUsers: new FormControl(bpmnElement?.businessObject.candidateUsers),
                candidateGroups: new FormControl(bpmnElement?.businessObject.candidateGroups),
            });
            this.fg.valueChanges.pipe(debounceTime(100)).subscribe(formValue => {
                for (const key in formValue) {
                    this.setUserTaskProperty(key, formValue[key]);
                }
            });
        });
    }

    setUserTaskProperty(name: string, value: string): void {
        if (!value) return;
        const prop = new BpmnProperty(name, value);
        this.extensionService.updateBaseProperty(prop);
    }

}
