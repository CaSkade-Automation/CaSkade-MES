import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProcessDefinitionService } from '../../../../shared/services/bpmn/process-definition.service';
import { GraphDbRepoService } from '../../../../shared/services/graphDbRepoService.service';
import { MtpMappingService } from '../../../../shared/services/mtp-mapping.service';
import { PlcMappingService } from '../../../../shared/services/plc-mapping.service';

@Component({
    selector: 'settings-overview',
    templateUrl: './settings-overview.component.html',
    styleUrls: ['./settings-overview.component.scss']
})
export class SettingsOverviewComponent implements OnInit {

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
    ){

    }

    ngOnInit(): void {
        this.setValue(this.graphDbService.isConnected(), this.apiConnectionForm.controls.graphDbConnected);
        this.setValue(this.processService.isConnected(), this.apiConnectionForm.controls.processServiceConnected);
        this.setValue(this.mtpMappingService.isConnected(), this.apiConnectionForm.controls.mtpMappingServiceConnected);
        this.setValue(this.plcMappingService.isConnected(), this.apiConnectionForm.controls.plcMappingServiceConnected);
    }

    setValue(obs: Observable<HttpResponse<any>>, fC: FormControl): void {
        obs.subscribe({
            next: (val) => fC.setValue(true),
            error: (err) => fC.setValue(false)
        });
        this.apiConnectionForm.get("graphDbConnected").value;
    }
}
