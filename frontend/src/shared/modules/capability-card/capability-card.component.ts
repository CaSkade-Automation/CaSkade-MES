import { AfterContentInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { Capability } from '../../models/Capability';
import { CapabilityService } from '../../services/capability.service';
import { Tooltip } from 'bootstrap';
import { ModuleService } from '../../services/module.service';
import { MessageService } from '../../services/message.service';
import { ClipboardService } from '../../services/ClipboardService';
import { Router } from '@angular/router';

@Component({
    selector: 'capability-card',
    templateUrl: './capability-card.component.html',
    styleUrls: ['./capability-card.component.scss']
})
export class CapabilityCardComponent implements AfterContentInit, OnDestroy {

    @Input() capability: Capability;
    @Output("onCapabilityDeleted") onCapabilityDeleted = new EventEmitter<string>();

    inputPropertiesShown = new Array<boolean>(false);
    outputPropertiesShown = new Array<boolean>(false);

    @ViewChild('copyToolTip') copyToolTipElem: ElementRef;
    copyToolTip!: Tooltip;
    @ViewChild('editToolTip') editToolTipElem: ElementRef;
    editToolTip!: Tooltip;
    @ViewChild('graphVisuToolTip') graphVisuToolTipElem: ElementRef;
    graphVisuToolTip!: Tooltip;
    @ViewChild('deleteCapToolTip') deleteCapToolTipElem: ElementRef;
    deleteCapToolTip!: Tooltip;

    copyButtonClass = 'btn-secondary'
    clipBoardClass = 'fa-regular fa-clipboard';

    constructor(
        private capabilityService: CapabilityService,
        private clipboardService: ClipboardService,
    ) {}

    ngAfterContentInit(): void {
        // Activate tooltips
        setTimeout(() => {
            this.copyToolTip = new Tooltip(this.copyToolTipElem.nativeElement);
            this.editToolTip = new Tooltip(this.editToolTipElem.nativeElement);
            this.graphVisuToolTip = new Tooltip(this.graphVisuToolTipElem.nativeElement);
            this.deleteCapToolTip = new Tooltip(this.deleteCapToolTipElem.nativeElement);
        }, 100);
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

    toggleInputProperties(i: number): void {
        this.inputPropertiesShown[i] = !this.inputPropertiesShown[i];
    }

    toggleOutputProperties(i: number): void {
        this.outputPropertiesShown[i] = !this.outputPropertiesShown[i];
    }

    deleteCapability(): void {
        this.capabilityService.deleteCapability(this.capability.iri).pipe(take(1)).subscribe();
        this.onCapabilityDeleted.emit(this.capability.iri);
    }

    ngOnDestroy(): void {
        this.editToolTip.hide();
    }
}
