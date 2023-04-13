import { Component, EventEmitter, Input, Output } from '@angular/core';
import { take } from 'rxjs';
import { Capability } from '../../models/Capability';
import { CapabilityService } from '../../services/capability.service';

@Component({
    selector: 'capability-card',
    templateUrl: './capability-card.component.html',
    styleUrls: ['./capability-card.component.scss']
})
export class CapabilityCardComponent {

    @Input() capability: Capability;
    @Output("onCapabilityDeleted") onCapabilityDeleted = new EventEmitter<string>();

    constructor(
        private capabilityService: CapabilityService
    ) {}


    deleteCapability(): void {
        this.capabilityService.deleteCapability(this.capability.iri).pipe(take(1)).subscribe();
        this.onCapabilityDeleted.emit(this.capability.iri);
    }

}
