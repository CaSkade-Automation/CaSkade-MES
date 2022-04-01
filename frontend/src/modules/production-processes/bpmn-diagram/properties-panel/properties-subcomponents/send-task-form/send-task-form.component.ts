import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CamundaMailService } from '../../bpmn-mail.service';

@Component({
    selector: 'send-task-form',
    templateUrl: './send-task-form.component.html',
    styleUrls: ['./send-task-form.component.scss']
})
export class SendTaskFormComponent implements OnInit {

    @Input() bpmnElement: any;
    sendTaskType= "mail";

    constructor() { }

    ngOnInit(): void {

    }

}
