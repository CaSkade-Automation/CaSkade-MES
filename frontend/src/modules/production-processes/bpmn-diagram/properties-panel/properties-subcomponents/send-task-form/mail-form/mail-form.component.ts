import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CamundaMailConnectorFunction, CamundaMailEntry, CamundaMailService } from '../../../bpmn-mail.service';

@Component({
    selector: 'mail-form',
    templateUrl: './mail-form.component.html',
    styleUrls: ['./mail-form.component.scss']
})
export class MailFormComponent implements OnInit {

    @Input() bpmnElement

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

    constructor(private bpmnMailElementService: CamundaMailService) { }

    ngOnInit() {
        const mailEntry = this.bpmnMailElementService.getMailEntry(this.bpmnElement);
        // this.mailFg.setValue(mailEntry);
    }

    submit(): void {
        this.bpmnMailElementService.addMailEntry(this.bpmnElement, CamundaMailConnectorFunction['mail-send'], this.mailFg.value as CamundaMailEntry);
    }

}
