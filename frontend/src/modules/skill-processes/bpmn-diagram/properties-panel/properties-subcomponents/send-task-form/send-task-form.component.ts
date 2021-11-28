import { Component, Input, OnInit } from '@angular/core';
import { CamundaConnectorService } from '../../camunda-connector.service';

@Component({
    selector: 'send-task-form',
    templateUrl: './send-task-form.component.html',
    styleUrls: ['./send-task-form.component.scss']
})
export class SendTaskFormComponent implements OnInit {

    @Input() bpmnElement: any;

    constructor(
        private connectorService: CamundaConnectorService
    ) { }

    ngOnInit() {
        this.connectorService.addConnectorEntry();
    }

}
