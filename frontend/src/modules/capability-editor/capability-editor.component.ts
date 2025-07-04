import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CapabilityService } from '../../shared/services/capability.service';
import { Modal } from 'bootstrap';
import { ProductionModule } from '../../shared/models/ProductionModule';
import { FormControl } from '@angular/forms';
import { ModuleService } from '../../shared/services/module.service';
import { MessageService } from '../../shared/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { Capability } from '../../shared/models/Capability';
import { CapabilityType } from '../../../../shared/src/models/capability/CapabilityType';
import { Observable} from 'rxjs';

@Component({
    selector: 'app-capability-editor',
    templateUrl: './capability-editor.component.html',
    styleUrls: ['./capability-editor.component.scss']
})
export class CapabilityEditorComponent implements OnInit {

    capabilities$: Observable<Array<Capability>>;
    capabilityToEdit!: Capability;

    capabilitySelect = new FormControl(null);

    @ViewChild('setRequiredInfoModal') setRequiredInfoModalElement: ElementRef
    setRequiredModal: Modal;
    @ViewChild('setProvidedInfoModal') setProvidedInfoModalElement: ElementRef
    setProvidedModal: Modal;

    propertiesShown = new Map<string, Array<boolean>>();

    // Utility mapping to show human-readable names
    propertiesMapping: {[k: string]: string} = {
        '=0': 'No properties',
        '=1': '1 Property',
        'other': '# Properties',
    };

    resources = new Array<ProductionModule>();
    providingResource = new FormControl("")

    constructor(
        readonly route: ActivatedRoute,
        readonly capabilityService: CapabilityService,
        readonly resourceService: ModuleService,
        readonly messageService: MessageService,
    ) {
        // Initialize properties shown:
        this.propertiesShown.set("input", new Array<false>());
        this.propertiesShown.set("output", new Array<false>());
    }

    ngOnInit(): void {
        this.capabilities$ = this.capabilityService.getCapabilities();
        // TODO: This is quite ugly. Reactive code would be nicer
        this.route.paramMap.subscribe(params => {
            if(params.keys.length ==0) return;

            const capabilityIri = params.get('capability-iri'); // Access the route parameter
            this.capabilityService.getCapabilityByIri(capabilityIri).subscribe(cap => {
                this.capabilityToEdit = cap;
                this.capabilitySelect.setValue(cap);
            });
        });

        this.capabilitySelect.valueChanges.subscribe(selectedCapability => {
            this.capabilityToEdit = selectedCapability;
            console.log(this.capabilityToEdit);
        });
    }

    /**
     * Little comparison utility to set values on the capability select
     * @param cap1
     * @param cap2
     * @returns
     */
    compareCaps(cap1: Capability, cap2: Capability): boolean {
        return cap1 && cap2 && cap1.iri === cap2.iri;
    }

    setRequired(): void {
        const elem = this.setRequiredInfoModalElement.nativeElement;
        this.setRequiredModal = new Modal(elem);
        this.setRequiredModal.show();
    }

    setProvided(): void {
        const elem = this.setProvidedInfoModalElement.nativeElement;
        this.setProvidedModal = new Modal(elem);
        this.resourceService.getModules().subscribe(resources => {
            this.resources = resources;
            this.providingResource.patchValue(this.resources[0].iri);
            this.setProvidedModal.show();
        });
    }

    confirmSetRequired(): void {
        this.capabilityService.changeCapabilityType(this.capabilityToEdit.iri, CapabilityType.RequiredCapability, null).subscribe(res => {
            this.setRequiredModal.dispose();
            this.messageService.info("Set required", `Capability ${this.capabilityToEdit.iri} was successfully set as a required capability`);
            this.capabilityService.getCapabilityByIri(this.capabilityToEdit.iri).subscribe(res => this.capabilityToEdit = res);
        });
    }

    confirmSetProvided(): void {
        const providingResourceIri = this.providingResource.value;
        this.capabilityService.changeCapabilityType(this.capabilityToEdit.iri, CapabilityType.ProvidedCapability, providingResourceIri).subscribe(res => {
            this.setProvidedModal.dispose();
            this.messageService.info("Set provided", `Capability ${this.capabilityToEdit.iri} was successfully set as a provided capability that is provided by ${providingResourceIri}`);
            this.capabilityService.getCapabilityByIri(this.capabilityToEdit.iri).subscribe(res => this.capabilityToEdit = res);
        });
    }

    toggleProperties(type: string, i: number): void {
        this.propertiesShown.get(type)[i]= !this.propertiesShown.get(type)[i];
    }

}
