import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormArray, Validators } from '@angular/forms';
import { CapabilityService } from '../../../shared/services/capability.service';
import { Observable, filter, map } from 'rxjs';
import { Capability } from '../../../shared/models/Capability';


@Component({
    selector: 'new-plan',
    templateUrl: './new-plan.component.html',
})
export class NewOrderComponent implements OnInit {

    requiredCapabilities$: Observable<Capability[]>

    processes: string[];

    selectedFiles=new Array<File>();
    logicInterpretations = ["<", "<=", "=", "=>", ">"];

    orderInquiryForm = this.fb.group({
        requiredCapability: this.fb.control("", Validators.required),
        selectedRestrictions: this.fb.array([
            this.fb.group({
                propertyType: [''],
                logicInterpretation: [''],
                value: ['']
            })
        ])
    })


    constructor(
        private fb: FormBuilder,
        private capabilityService: CapabilityService
    ) {}

    ngOnInit() {
        this.requiredCapabilities$ = this.capabilityService.getCapabilities()
            .pipe(
                map(caps => caps.filter(cap => cap.capabilityType.iri == "http://www.w3id.org/hsu-aut/cask#RequiredCapability"))
            );
    }


    onFilesSelected(event) {
        // add the selected files to the list of files to upload
        for (let i = 0; i < event.target.files.length; i++) {
            this.selectedFiles.push(event.target.files[i]);
        }
    }

    onSubmit(){

        // this.selectedFiles.forEach(file => {
        //   fd.append('part', file, file.name);
        // });
        // this.httpClient.post('/api/order-management/upload', fd)
        //   .subscribe(res => {
        //     this.router.navigate(['../upload-summary'], {relativeTo: this.route})
        // })
    }

    deleteFile(index: number) {
        this.selectedFiles.splice(index, 1);
    }


    get selectedRestrictions() {
        return this.orderInquiryForm.get('selectedRestrictions') as FormArray;
    }

    addRestriction(){
        this.selectedRestrictions.push(
            this.fb.group({
                propertyType: [''],
                logicInterpretation: [''],
                value: ['']
            })
        );
    }

    removeRestriction(i: number) {
        this.selectedRestrictions.removeAt(i);
    }

}


