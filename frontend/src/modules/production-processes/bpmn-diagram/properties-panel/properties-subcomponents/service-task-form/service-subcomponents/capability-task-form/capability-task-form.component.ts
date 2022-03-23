import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Capability } from '@shared/models/capability/Capability';
import { Isa88CommandTypeIri } from '@shared/models/state-machine/ISA88/ISA88CommandTypeIri';

@Component({
    selector: 'capability-task-form',
    templateUrl: './capability-task-form.component.html',
    styleUrls: ['./capability-task-form.component.scss']
})
export class CapabilityTaskFormComponent implements OnInit {

    capabilities = new Array<Capability>();
    selectedCapability: Capability;

    // Definition of the FormGroup
    fg = new FormGroup({
        capabilityIri: new FormControl(),
        commandTypeIri: new FormControl(Isa88CommandTypeIri.Start),
        properties: new FormGroup({}),
        selfResetting: new FormControl(true),
    });

    commands = Isa88CommandTypeIri;
    commandKeys;

    constructor() { }

    ngOnInit() {
    }

    /**
	 * Convenience getter that simplifies getting the properties sub-FormGroup
	 */
    get fgProperties(): FormGroup {
        return this.fg.controls.properties as FormGroup;
    }

}
