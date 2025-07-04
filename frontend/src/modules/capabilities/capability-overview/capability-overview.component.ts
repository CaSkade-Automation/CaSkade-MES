import { Component, OnInit } from '@angular/core';
import { CapabilityService } from 'src/shared/services/capability.service';
import { Observable, Subscription, from } from 'rxjs';
import { Capability } from '../../../shared/models/Capability';
import { FormControl, FormGroup } from '@angular/forms';
import { CapabilityType } from '@shared/models/capability/CapabilityType';

@Component({
    selector: 'app-capability-overview',
    templateUrl: './capability-overview.component.html',
    styleUrls: ['./capability-overview.component.scss']
})
export class CapabilityOverviewComponent implements OnInit {

    constructor(
        private capabilityService: CapabilityService,
    ) {}

    capabilityTypeForm = new FormGroup({
        showProvided: new FormControl(true),
        showRequired: new FormControl(true)
    })

    // Subscription to all capabilities that is always updated through sockets and subscribed to using the async pipe
    capabilities$: Observable<Array<Capability>>

    ngOnInit(): void {
        this.capabilities$ = this.capabilityService.getCapabilities();
        this.capabilities$.subscribe(caps => console.log(caps));
        // Filter logic
        this.capabilityTypeForm.valueChanges.subscribe(val => {
            const {showProvided, showRequired} = val;
            if(showProvided && showRequired) this.capabilityService.loadCapabiltiesAndSubscribe(CapabilityType.All);
            if(showProvided && !showRequired) this.capabilityService.loadCapabiltiesAndSubscribe(CapabilityType.ProvidedCapability);
            if(!showProvided && showRequired) this.capabilityService.loadCapabiltiesAndSubscribe(CapabilityType.RequiredCapability);
            if(!showProvided && !showRequired) this.capabilityService.loadCapabiltiesAndSubscribe(CapabilityType.None);
        });
    }

    reloadCapabilities(): void {
        this.capabilityService.reloadCapabilities();
    }

}
