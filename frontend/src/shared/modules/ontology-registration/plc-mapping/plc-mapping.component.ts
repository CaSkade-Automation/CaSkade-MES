import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { PlcMappingService } from 'src/shared/services/plc-mapping.service';
import { PlcMappingRequest } from '@shared/models/mappings/PlcMappingRequest';
import { MessageService } from '../../../services/message.service';

@Component({
    selector: 'plc-mapping',
    templateUrl: './plc-mapping.component.html',
    styleUrls: ['./plc-mapping.component.scss']
})
export class PlcMappingComponent {

    plcMappingForm = this.fb.group({
        files: this.fb.control<FileList>(null, Validators.required),
        endpointUrl: this.fb.control("", Validators.required),
        baseIri: this.fb.control("http://www.hsu-hh.de/aut/PLC2Skill"),
        resourceIri: this.fb.control(""),
        requiresAuth: this.fb.control(false),
        user: this.fb.control("",),
        password: this.fb.control(""),
        nodeIdManual: this.fb.control(false),
        nodeIdRoot: this.fb.control("")
    })

    fileSelected = false;

    constructor(
        private plcMappingService: PlcMappingService,
        private fb: FormBuilder,
        private messageService: MessageService) { }


    get selectedFileName(): string {
        return this.plcMappingForm.get('files').value.item(0).name;
    }

    get nodeIdManual(): boolean {
        return this.plcMappingForm.get('nodeIdManual').value;
    }

    get requiresAuth(): boolean {
        return this.plcMappingForm.get('requiresAuth').value;
    }

    get formValid(): boolean {
        return this.plcMappingForm.valid;
    }

    submit(): void {
        const {files,endpointUrl, baseIri, resourceIri, user, password, nodeIdRoot} = this.plcMappingForm.value;
        const request = new PlcMappingRequest(files.item(0), endpointUrl, baseIri, resourceIri, user, password, nodeIdRoot);
        this.plcMappingService.executeMapping(request).pipe(take(1)).subscribe({
            next: () => this.messageService.info("Started mapping", `Mapping of file ${files.item(0).name} successfully started. This may take a while...`),
            error: (err) => this.messageService.warn("Error while starting mapping", `Error while starting the mapping of file ${files.item(0).name}. Error:${err}`)
        });
    }

}
