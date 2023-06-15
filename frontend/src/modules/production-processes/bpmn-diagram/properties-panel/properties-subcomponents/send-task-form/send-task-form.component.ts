import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CamundaMailService } from '../../bpmn-mail.service';
import { Observable } from 'rxjs';
import { BpmnElement } from '../../../BpmnDataModel';

@Component({
    selector: 'send-task-form',
    templateUrl: './send-task-form.component.html',
    styleUrls: ['./send-task-form.component.scss']
})
export class SendTaskFormComponent implements OnInit {

    @Input() bpmnElement$: Observable<BpmnElement>;
    sendTaskType= "mail";

    constructor() { }

    ngOnInit(): void {

    }

}
