import { Component, Input } from '@angular/core';
import { RdfElement } from '../../../../../shared/src/models/RdfElement';
import { Tooltip } from 'bootstrap';

@Component({
    selector: 'app-fpb-state',
    templateUrl: './fpb-state-icon.component.html',
})
export class FpbStateIconComponent {

    @Input('stateType') stateType: RdfElement;

    ngAfterViewInit(): void {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
    }
}
