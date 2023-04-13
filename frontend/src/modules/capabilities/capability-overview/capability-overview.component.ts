import { Component, OnInit } from '@angular/core';
import { CapabilityService, CapabilityTypes } from 'src/shared/services/capability.service';
import { Subscription } from 'rxjs';
import { Capability } from '../../../shared/models/Capability';
import { Skill } from '../../../shared/models/Skill';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-capability-overview',
    templateUrl: './capability-overview.component.html',
    styleUrls: ['./capability-overview.component.scss']
})
export class CapabilityOverviewComponent implements OnInit {

    constructor(
        private capabilityService: CapabilityService,
    ) {}

    capabilities= new Array<Capability>();
    skillsOfModule = new Array<Skill>();

    capabilityTypeForm = new FormGroup({
        showProvided: new FormControl(true),
        showRequired: new FormControl(true)
    })

    capabilitySubscription: Subscription;

    ngOnInit(): void {
        this.loadCapabilities(CapabilityTypes.All);
        this.capabilityTypeForm.valueChanges.subscribe(val => {
            console.log("new val");
            const {showProvided, showRequired} = val;
            console.log(showProvided);
            console.log(showRequired);
            if(showProvided && showRequired) this.loadCapabilities(CapabilityTypes.All);
            if(showProvided && !showRequired) this.loadCapabilities(CapabilityTypes.ProvidedCapability);
            if(!showProvided && showRequired) this.loadCapabilities(CapabilityTypes.RequiredCapability);
            if(!showProvided && !showRequired) this.capabilities = [];
        });
    }

    loadCapabilities(type?: CapabilityTypes): void {
        this.capabilitySubscription = this.capabilityService.getAllCapabilities(type).subscribe(caps => this.capabilities = caps);
    }

    onCapabilityDeleted(capabilityIri: string): void {
        // remove capability with that id from the list
        const capabilityIndex = this.capabilities.findIndex(cap => cap.iri == capabilityIri);
        this.capabilities.splice(capabilityIndex, 1);
    }

    ngOnDestroy(): void {
        this.capabilitySubscription.unsubscribe();
    }

}
