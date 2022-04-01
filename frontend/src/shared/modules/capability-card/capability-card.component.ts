import { Component, Input } from '@angular/core';
import { Capability } from '../../models/Capability';
import { CapabilityService } from '../../services/capability.service';

@Component({
    selector: 'capability-card',
    templateUrl: './capability-card.component.html',
    styleUrls: ['./capability-card.component.scss']
})
export class CapabilityCardComponent {

    @Input() capability: Capability;


    constructor(
        private capabilityService: CapabilityService
    ) {}


    deleteCapability() {
        this.capabilityService.deleteCapability(this.capability.iri).subscribe(data => console.log(data));
    }

}
