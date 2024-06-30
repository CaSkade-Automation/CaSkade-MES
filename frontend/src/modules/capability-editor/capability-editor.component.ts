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
import { Observable } from 'rxjs';

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

    resources = new Array<ProductionModule>();
    providingResource = new FormControl("")

    constructor(
        readonly route: ActivatedRoute,
        readonly capabilityService: CapabilityService,
        readonly resourceService: ModuleService,
        readonly messageService: MessageService,
    ) { }

    ngOnInit(): void {
        this.capabilities$ = this.capabilityService.getCapabilities();
        // TODO: This is quite ugly. Reactive code would be nicer
        this.route.paramMap.subscribe(params => {
            const capabilityIri = params.get('capability-iri'); // Access the route parameter
            this.capabilityService.getCapabilityByIri(capabilityIri).subscribe(data => this.capabilityToEdit = data);
        });

        this.capabilitySelect.valueChanges.subscribe(selectedCapability => this.capabilityToEdit = selectedCapability);
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
            this.setRequiredModal.hide();
            this.messageService.info("Set required", `Capability ${this.capabilityToEdit.iri} was successfully set as a required capability`);
            this.capabilityService.getCapabilityByIri(this.capabilityToEdit.iri).subscribe(res => this.capabilityToEdit = res);
        });
    }

    confirmSetProvided(): void {
        const providingResourceIri = this.providingResource.value;
        console.log(this.providingResource);

        this.capabilityService.changeCapabilityType(this.capabilityToEdit.iri, CapabilityType.ProvidedCapability, providingResourceIri).subscribe(res => {
            this.setProvidedModal.hide();
            this.messageService.info("Set provided", `Capability ${this.capabilityToEdit.iri} was successfully set as a provided capability that is provided by ${providingResourceIri}`);
            this.capabilityService.getCapabilityByIri(this.capabilityToEdit.iri).subscribe(res => this.capabilityToEdit = res);
        });
    }

}
