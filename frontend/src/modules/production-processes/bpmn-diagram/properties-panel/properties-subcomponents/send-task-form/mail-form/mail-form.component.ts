import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CamundaMailConnectorFunction, CamundaMailEntry, CamundaMailService } from '../../../bpmn-mail.service';
import { Observable, filter } from 'rxjs';
import { BpmnElement } from '../../../../BpmnDataModel';

@Component({
    selector: 'mail-form',
    templateUrl: './mail-form.component.html',
    styleUrls: ['./mail-form.component.scss']
})
export class MailFormComponent implements OnInit {

    @Input() bpmnElement$: Observable<BpmnElement>

    mailFg = new FormGroup({
        to: new FormControl("", [Validators.required, Validators.email]),
        cc: new FormControl("", [Validators.email]),
        bcc: new FormControl("", [Validators.email]),
        subject: new FormControl("", [Validators.required]),
        text: new FormControl(""),
        // html: new FormControl(""),
        // filesNames : new FormArray([
        //     new FormControl("")
        // ])
    })

    mailEntry: CamundaMailEntry

    constructor(private bpmnMailElementService: CamundaMailService) { }

    ngOnInit() {
        this.bpmnElement$.pipe(filter(bpmnElement => bpmnElement.type == "bpmn:SendTask")).subscribe(bpmnElement => {
            this.mailEntry = this.bpmnMailElementService.getMailEntry(bpmnElement);
        });
        // this.mailFg.setValue(mailEntry);
    }

    submit(): void {
        this.bpmnMailElementService.addMailEntry(this.mailEntry, CamundaMailConnectorFunction['mail-send'], this.mailFg.value as CamundaMailEntry);
    }

}
