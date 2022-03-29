import { Component, Input, OnInit } from '@angular/core';
import { Capability } from '../../../../models/capability/Capability';

@Component({
    selector: 'app-capability-card',
    templateUrl: './capability-card.component.html',
    styleUrls: ['./capability-card.component.scss']
})
export class CapabilityCardComponent implements OnInit {

    @Input() capability: Capability;


    constructor() { }

    ngOnInit() {
    }

    deleteCapability() {

    }

}
