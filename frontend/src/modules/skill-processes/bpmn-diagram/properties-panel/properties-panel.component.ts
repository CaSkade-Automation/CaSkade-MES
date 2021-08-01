import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, transition, style, animate, state, group, animateChild, query } from '@angular/animations';
import { FormGroup } from '@angular/forms';
import { BaseProperty, SkillSelectionProperty } from './properties-subcomponents/Property';
import { PropertyController } from './properties-subcomponents/property-controller/PropertyController';
import { SkillService } from 'src/shared/services/skill.service';
import { FlowPropertyController } from './properties-subcomponents/property-controller/FlowPropertyController';
import { ServiceTaskPropertyController } from './properties-subcomponents/property-controller/ServiceTaskPropertyController';
import { ProcessPropertyController } from './properties-subcomponents/property-controller/ProcessPropertyController';
import { BpmnDataModel } from '../BpmnDataModel';

@Component({
    selector: 'properties-panel',
    animations: [
        trigger(
            'enterAnimation', [
                state('true',
                    // state when div is shown
                    style({transform: 'translateX(0)', height: "100%"}),
                ),
                state('false',
                    // state when div is hidden
                    style({transform: 'translateX(92%)', height: "100%"})
                ),
                transition('false => true', [
                    // animation to show
                    group([
                        animate('500ms', style({transform: 'translateX(0%)', opacity: 1})),
                        query('@theChildAnimation', animateChild())
                    ])
                ]),
                transition('true => false', [
                    // animation to hide
                    group([
                        animate('500ms', style({transform: 'translateX(90%)', opacity: 1})),
                        // query('@theChildAnimation', animateChild())
                    ])
                ]),
            ]
        ),
        // Separate animation of the content which is separately faded
        trigger('theChildAnimation', [
            state('true',
            // state when div is shown
                style({opacity: 1}),
            ),
            state('false',
            // state when div is hidden
                style({opacity: 0}),
            ),
            transition( '* <=> *', [
                animate('500ms'),
            ],
            ),
        ] ),
    ],
    templateUrl: './properties-panel.component.html',
    styleUrls: ['./properties-panel.component.scss'],
})
export class PropertiesPanelComponent implements OnChanges, OnInit {
    @Input() bpmnElement: any;
    @Input() bpmnModeler: any;  // Gets passed in from the modeler component

    bpmnDataModel: BpmnDataModel // Is passed into the dynamic property component

    shown: boolean;     // Defines the state of the panel (shown or hidden)

    propertyController: PropertyController;
    properties: BaseProperty[];

    form: FormGroup;
    payLoad = '';

    constructor(private skillService: SkillService) {
    }

    ngOnInit() {
        // this.bpmnDataModel = new BpmnDataModel(this.bpmnModeler.get("modeling"));
        this.form.valueChanges.subscribe(data => console.log(data));
    }

    ngOnChanges(changes: SimpleChanges): void {
        switch (this.bpmnElement?.type) {
        case "bpmn:Process":
            this.propertyController = new ProcessPropertyController();
            break;
        case "bpmn:SequenceFlow":
            this.propertyController = new FlowPropertyController();
            break;
        case "bpmn:ServiceTask":
            this.propertyController = new ServiceTaskPropertyController(this.skillService);
            break;
        default:
            this.propertyController = new PropertyController();
            break;
        }

        this.properties = this.propertyController.createPropertyGroups(this.bpmnElement);
        this.form = this.propertyController.toFormGroup(this.properties);
    }


    onSubmit() {
        this.payLoad = this.form.getRawValue();
        console.log("form value");
        console.log(this.form.value);
        console.log("the form");
        console.log(this.form);

        // apply some transformations to make sure input matches BPMN
        const transformedValues = this.propertyController.transformFormValues(this.payLoad);

    }

    /**
     * Depending on the current state, hides or shows the property panel
     */
    togglePropertiesPanel(): void {
        this.shown = !this.shown;
    }
}
