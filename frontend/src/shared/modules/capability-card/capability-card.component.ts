import { AfterContentInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { Capability } from '../../models/Capability';
import { CapabilityService } from '../../services/capability.service';
import { Modal, Tooltip } from 'bootstrap';
import { FormControl } from '@angular/forms';
import { ModuleService } from '../../services/module.service';
import { ProductionModule } from '../../models/ProductionModule';
import { CapabilityType } from '../../../../../shared/src/models/capability/CapabilityType';
import { MessageService } from '../../services/message.service';
import { ClipboardService } from '../../services/ClipboardService';

@Component({
    selector: 'capability-card',
    templateUrl: './capability-card.component.html',
    styleUrls: ['./capability-card.component.scss']
})
export class CapabilityCardComponent implements AfterContentInit {

    @Input() capability: Capability;
    @Output("onCapabilityDeleted") onCapabilityDeleted = new EventEmitter<string>();

    @ViewChild('copyToolTip') copyToolTip: ElementRef;
    @ViewChild('setRequiredInfoModal') setRequiredInfoModalElement: ElementRef
    setRequiredModal: Modal;
    @ViewChild('setProvidedInfoModal') setProvidedInfoModalElement: ElementRef
    setProvidedModal: Modal;

    resources = new Array<ProductionModule>();
    providingResource = new FormControl("")

    copyButtonClass = 'btn-secondary'
    clipBoardClass = 'fa-regular fa-clipboard';

    constructor(
        private messageService: MessageService,
        private resourceService: ModuleService,
        private capabilityService: CapabilityService,
        private clipboardService: ClipboardService,
    ) {}

    ngAfterContentInit(): void {
        setTimeout(() => new Tooltip(this.copyToolTip.nativeElement), 100);
    }

    async copyIRI(): Promise<void> {
        const success = await this.clipboardService.copyTextToClipboard(this.capability.iri);
        if (success) {
            this.copyButtonClass = 'btn-success';
            this.clipBoardClass = 'fa-solid fa-clipboard-check';
            setTimeout(() => {
                this.copyButtonClass = 'btn-secondary';
                this.clipBoardClass = 'fa-regular fa-clipboard';
            }, 2000);
        }
    }

    deleteCapability(): void {
        this.capabilityService.deleteCapability(this.capability.iri).pipe(take(1)).subscribe();
        this.onCapabilityDeleted.emit(this.capability.iri);
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
        this.capabilityService.changeCapabilityType(this.capability.iri, CapabilityType.RequiredCapability, null).subscribe(res => {
            this.setRequiredModal.hide();
            this.messageService.info("Set required", `Capability ${this.capability.iri} was successfully set as a required capability`);
            this.capabilityService.getCapabilityByIri(this.capability.iri).subscribe(res => this.capability = res);
        });
    }

    confirmSetProvided(): void {
        const providingResourceIri = this.providingResource.value;
        console.log(this.providingResource);

        this.capabilityService.changeCapabilityType(this.capability.iri, CapabilityType.ProvidedCapability, providingResourceIri).subscribe(res => {
            this.setProvidedModal.hide();
            this.messageService.info("Set provided", `Capability ${this.capability.iri} was successfully set as a provided capability that is provided by ${providingResourceIri}`);
            this.capabilityService.getCapabilityByIri(this.capability.iri).subscribe(res => this.capability = res);
        });
    }
}
