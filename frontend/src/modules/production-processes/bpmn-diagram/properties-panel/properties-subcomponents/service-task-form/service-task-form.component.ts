import { Component, Input, OnInit } from '@angular/core';
import { BpmnProperty } from '../../../BpmnDataModel';
import { BpmnExtensionElementService } from '../../bpmn-extension-element.service';

@Component({
    selector: 'service-task-form',
    templateUrl: './service-task-form.component.html',
    styleUrls: ['./service-task-form.component.scss']
})
export class ServiceTaskFormComponent implements OnInit {

    @Input("bpmnElement") bpmnElement;
    types = ["Capability", "Skill", "Web Service"];     // possible "sub types" of service tasks
    serviceTaskType = "Capability";                     // the currently selected type

    constructor(
        private extensionElementService: BpmnExtensionElementService
    ) { }

    ngOnInit() {
        const typeProperty = new BpmnProperty("serviceTaskType", this.serviceTaskType);
        this.extensionElementService.updateBaseProperty(typeProperty);
    }

    changeType(newValue: string) {
        console.log(newValue);
        const typeProperty = new BpmnProperty("serviceTaskType", this.serviceTaskType);
        this.extensionElementService.updateBaseProperty(typeProperty);
    }

}
