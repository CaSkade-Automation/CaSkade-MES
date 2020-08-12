import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'properties-panel',
    animations: [
        trigger(
            'enterAnimation', [
                transition(':enter', [
                    style({transform: 'translateX(100%)', opacity: 0}),
                    animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
                ]),
                transition(':leave', [
                    style({transform: 'translateX(0)', opacity: 1}),
                    animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
                ])
            ]
        )
    ],
    templateUrl: './properties-panel.component.html',
    styleUrls: ['./properties-panel.component.scss'],
})
export class PropertiesPanelComponent {
    @Input() show: boolean;
    @Input() element: any;

    isMenuOpen = false;

    clickedDivState = 'start';

    changeDivState() {
        this.clickedDivState = 'end';
        setTimeout(() => {
            this.clickedDivState = 'start';
        }, 3000);
    }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }
}
