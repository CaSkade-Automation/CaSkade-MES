import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, transition, style, animate, state, group, animateChild, query } from '@angular/animations';
import { FormGroup } from '@angular/forms';
import { BpmnDataModel, BpmnElement, BpmnProperty } from '../BpmnDataModel';


import { BpmnExtensionElementService } from './bpmn-extension-element.service';
import { BpmnModelService } from './bpmn-model.service';
import { CamundaMailService } from './bpmn-mail.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'properties-panel',
    animations: [
        trigger(
            'enterAnimation', [
                state('true',
                // state when div is shown
                    style({ transform: 'translateX(0)', height: "100%" }),
                ),
                state('false',
                // state when div is hidden
                    style({ transform: 'translateX(92%)', height: "100%" })
                ),
                transition('false => true', [
                // animation to show
                    group([
                        animate('500ms', style({ transform: 'translateX(0%)', opacity: 1 })),
                        query('@childAnimation', animateChild())
                    ])
                ]),
                transition('true => false', [
                // animation to hide
                    group([
                        animate('500ms', style({ transform: 'translateX(90%)', opacity: 1 })),
                    // query('@childAnimation', animateChild())
                    ])
                ]),
            ]
        ),
        // Separate animation of the content which is separately faded
        trigger('childAnimation', [
            state('true',
                // state when div is shown
                style({ opacity: 1 }),
            ),
            state('false',
                // state when div is hidden
                style({ opacity: 0 }),
            ),
            transition('* <=> *', [
                animate('500ms'),
            ],
            ),
        ]),
    ],
    templateUrl: './properties-panel.component.html',
    styleUrls: ['./properties-panel.component.scss'],
})
export class PropertiesPanelComponent implements OnInit {
    @Input() bpmnElement$: Observable<BpmnElement>;
    @Input() bpmnModeler: any;  // Gets passed in from the modeler component

    dataModel: BpmnDataModel;
    shown = true;     // Defines the state of the panel (shown or hidden)

    form = new FormGroup({});

    constructor(
        private extensionElementService: BpmnExtensionElementService,
        private modelService: BpmnModelService,
        private connectorService: CamundaMailService
    ) {}


    ngOnInit(): void {
        this.dataModel = new BpmnDataModel(this.bpmnModeler.get("modeling"));
        this.extensionElementService.setup(this.bpmnModeler, this.bpmnElement$);
        this.modelService.setup(this.bpmnModeler);
        this.connectorService.setup(this.bpmnModeler);
    }


    onSubmit() {
        console.log("form value");
        console.log(this.form.value);
        console.log("the form");
        console.log(this.form);
    }

    /**
     * Depending on the current state, hides or shows the property panel
     */
    togglePropertiesPanel(): void {
        this.shown = !this.shown;
    }
}

