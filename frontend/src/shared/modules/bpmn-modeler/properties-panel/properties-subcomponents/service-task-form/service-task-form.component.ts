import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BpmnElement, BpmnProperty } from '../../../BpmnDataModel';
import { BpmnExtensionElementService } from '../../bpmn-extension-element.service';
import { Observable, Subscription, filter } from 'rxjs';

@Component({
    selector: 'service-task-form',
    templateUrl: './service-task-form.component.html',
    styleUrls: ['./service-task-form.component.scss']
})
export class ServiceTaskFormComponent implements OnInit, OnDestroy {

    @Input() bpmnElement$: Observable<BpmnElement>;
    elementSubscription: Subscription;

    types = ["Capability", "Skill", "Web Service"];     // possible "sub types" of service tasks
    serviceTaskType: string;                     // the currently selected type

    constructor(
        private extensionElementService: BpmnExtensionElementService
    ) { }

    ngOnInit(): void {
        // set task type
        // this.updateTaskType();
        this.elementSubscription = this.bpmnElement$
            .pipe(filter(bpmnElement => bpmnElement.type == "bpmn:ServiceTask")).subscribe(bpmnElement => {
                console.log(bpmnElement);

                this.updateTaskType();
            });
    }

    updateTaskType(): void {
        // Get current input values from the model to populate form fields in the element already has a value
        const taskTypeProperty = this.extensionElementService.getCamundaProperty("serviceTaskType")?.value as string ?? "Capability";
        this.serviceTaskType = taskTypeProperty;
    }

    changeType(newType: string): void {
        const typeProperty = new BpmnProperty("serviceTaskType", newType);
        this.extensionElementService.updateCamundaProperty(typeProperty);
    }

    ngOnDestroy(): void {
        this.elementSubscription.unsubscribe();
    }

}
