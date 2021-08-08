import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, transition, style, animate, state, group, animateChild, query } from '@angular/animations';
import { FormGroup } from '@angular/forms';
import { PropertyBuilder } from './properties-subcomponents/property-controller/PropertyBuilder';
import { SkillService } from 'src/shared/services/skill.service';
import { FlowPropertyBuilder } from './properties-subcomponents/property-controller/FlowPropertyBuilder';
import { SkillTaskPropertyBuilder } from './properties-subcomponents/property-controller/SkillTaskPropertyBuilder';
import { ProcessPropertyBuilder } from './properties-subcomponents/property-controller/ProcessPropertyBuilder';
import { BpmnDataModel, BpmnProperty } from '../BpmnDataModel';
import { BpmnPropertyGroup } from './properties-subcomponents/bpmn-property/bpmn-property-group';
import { HumanTaskPropertyBuilder as UserTaskPropertyBuilder } from './properties-subcomponents/property-controller/UserTaskPropertyBuilder';

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

    dataModel: BpmnDataModel;
    shown = true;     // Defines the state of the panel (shown or hidden)

    propertyController: PropertyBuilder;
    propertyGroups: BpmnPropertyGroup[];

    form: FormGroup;
    payLoad = '';

    constructor(private skillService: SkillService) {
        this.form = new FormGroup({});
    }

    ngOnInit(): void {
        this.dataModel = new BpmnDataModel(this.bpmnModeler.get("modeling"));
        this.propertyGroups = this.propertyController.createPropertyGroups(this.bpmnElement);
    }

    ngOnChanges(changes: SimpleChanges): void {

        switch (this.bpmnElement?.type) {
        case "bpmn:Process":
            this.propertyController = new ProcessPropertyBuilder();
            break;
        case "bpmn:UserTask":
            this.propertyController = new UserTaskPropertyBuilder();
            break;
        case "bpmn:SequenceFlow":
            this.propertyController = new FlowPropertyBuilder();
            break;
        case "bpmn:ServiceTask":
            this.propertyController = new SkillTaskPropertyBuilder(this.skillService);
            break;
        default:
            this.propertyController = new PropertyBuilder();
            break;
        }

        this.propertyGroups = this.propertyController.createPropertyGroups(this.bpmnElement);

    }

    /**
     * Event handling function that gets called by the child BPMN property groups on every form change in order to propagate the changes to the BPMN data model
     * @param newProperty The new property that will be set on the model
     */
    onPropertyGroupChanged(newProperty: BpmnProperty): void {
        this.dataModel.updateProperty(this.bpmnElement, newProperty);
    }


    onSubmit() {
        this.payLoad = this.form.getRawValue();
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
