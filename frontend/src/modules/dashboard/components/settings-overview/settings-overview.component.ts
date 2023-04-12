import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProcessDefinitionService } from '../../../../shared/services/bpmn/process-definition.service';
import { GraphDbRepoService } from '../../../../shared/services/graphDbRepoService.service';
import { MtpMappingService } from '../../../../shared/services/mtp-mapping.service';
import { PlcMappingService } from '../../../../shared/services/plc-mapping.service';
import { MessageService } from '../../../../shared/services/message.service';
import {Modal} from "bootstrap";

@Component({
    selector: 'settings-overview',
    templateUrl: './settings-overview.component.html',
    styleUrls: ['./settings-overview.component.scss']
})
export class SettingsOverviewComponent implements OnInit {

    @ViewChild('graphDbWarningModal') graphDbWarningModal: ElementRef;

    apiConnectionForm = this.fb.group({
        graphDbConnected: this.fb.control({value: false, disabled: true}),
        processServiceConnected: this.fb.control({value: false, disabled: true}),
        mtpMappingServiceConnected: this.fb.control({value: false, disabled: true}),
        plcMappingServiceConnected: this.fb.control({value: false, disabled: true}),
    });


    constructor(
        private fb: FormBuilder,
        private graphDbService: GraphDbRepoService,
        private processService: ProcessDefinitionService,
        private mtpMappingService: MtpMappingService,
        private plcMappingService: PlcMappingService,
        private messageService: MessageService
    ){

    }

    ngOnInit(): void {
        this.setValue("GraphDB", this.graphDbService.isConnected(), this.apiConnectionForm.controls.graphDbConnected);
        this.setValue("BPMN Engine", this.processService.isConnected(), this.apiConnectionForm.controls.processServiceConnected);
        this.setValue("MTP Mapping Service", this.mtpMappingService.isConnected(), this.apiConnectionForm.controls.mtpMappingServiceConnected);
        this.setValue("PLC Mapping Service",this.plcMappingService.isConnected(), this.apiConnectionForm.controls.plcMappingServiceConnected);
    }

    setValue(apiName: string, obs: Observable<HttpResponse<any>>, fC: FormControl): void {
        obs.subscribe({
            next: (val) => fC.setValue(true),
            error: (err) => {
                fC.setValue(false);
                if(apiName == "GraphDB") this.showGraphDbWarningModal();
                else this.messageService.danger(`${apiName} not connected`, `No connection to ${apiName}. Make sure to start this service to use its features.`);
            }
        });
    }

    showGraphDbWarningModal(): void {
        const elem = this.graphDbWarningModal.nativeElement;
        const myModal = new Modal(elem);
        myModal.show();
    }
}
