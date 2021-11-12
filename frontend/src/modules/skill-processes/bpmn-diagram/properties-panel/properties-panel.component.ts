import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, transition, style, animate, state, group, animateChild, query } from '@angular/animations';
import { FormGroup } from '@angular/forms';
import { PropertyBuilder } from './properties-subcomponents/property-controller/PropertyBuilder';
import { SkillService } from 'src/shared/services/skill.service';
import { BpmnDataModel, BpmnProperty } from '../BpmnDataModel';
import { BpmnPropertyGroup } from './properties-subcomponents/bpmn-property/bpmn-property-group';
import * as InputOutputHelper from 'bpmn-js-properties-panel/lib/helper/InputOutputHelper';
import * as ExtensionElementHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

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
export class PropertiesPanelComponent implements OnChanges, OnInit {
    @Input() bpmnElement: any;
    @Input() bpmnModeler: any;  // Gets passed in from the modeler component

    dataModel: BpmnDataModel;
    shown = true;     // Defines the state of the panel (shown or hidden)

    propertyController: PropertyBuilder;
    propertyGroups: BpmnPropertyGroup[];

    form: FormGroup;

    constructor(private skillService: SkillService) {
        this.form = new FormGroup({});
    }

    ngOnInit(): void {
        this.dataModel = new BpmnDataModel(this.bpmnModeler.get("modeling"));
        // this.propertyGroups = this.propertyController.createPropertyGroups(this.bpmnElement);
    }

    getInputParmeters(): CamundaInputParameter[] {
        return InputOutputHelper.getInputParameters(this.bpmnElement) as CamundaInputParameter[];
    }

    /**
     * Adds an input parameter to the current bpmn element
     * @param value Value to be set as input parameter
     */
    addCamundaInputParameter(prop: BpmnProperty): void {
        const stringVal = JSON.stringify(prop.value);

        // TODO: Check if there are already input parameters. If so, don't create new ones
        const moddle = this.bpmnModeler.get("moddle");

        console.log("extension elems");
        console.log(ExtensionElementHelper.getExtensionElements(this.bpmnElement.businessObject));



        let existingInputParameters;
        let inputParameter;
        let inputOutput;
        // If this input parameter exists, set the new value
        try {
            existingInputParameters = this.getInputParmeters();
            inputParameter = existingInputParameters.find(input => input.name == prop.key);

            inputParameter.value = JSON.stringify(prop.value);
            inputOutput = moddle.create('camunda:InputOutput', {
                inputParameters: [...existingInputParameters]
            });
            console.log("changed existing");
            console.log(inputOutput);


        } catch (error) {
            console.log("error");
            console.log(error);


            // In case it doesn't exist, create a new one
            inputParameter = moddle.create('camunda:InputParameter', {
                name: `${prop.key}`,
                value: `${stringVal}`
            });
            inputOutput = moddle.create('camunda:InputOutput', {
                inputParameters: [...existingInputParameters, inputParameter]
            });
        }

        console.log("existing");
        console.log(existingInputParameters);
        console.log("new");
        console.log(inputParameter);


        console.log("inout");
        console.log(inputOutput);



        // const newInputParameters = inputParameters.push({name: `${prop.key}`,
        //     value: `${stringVal}`});


        const extensionElements = moddle.create('bpmn:ExtensionElements', {
            values: [inputOutput]
        });

        console.log("extension elements after update");
        console.log(extensionElements);


        this.bpmnModeler.get("modeling").updateProperties(this.bpmnElement, {
            "extensionElements": extensionElements
        });
    }

    updateBaseProperty(property: BpmnProperty) {
        this.dataModel.updateProperty(this.bpmnElement, property);
    }


    // const moddle = this.bpmnModeler.get("moddle");
    //     const inputParameter = moddle.create('camunda:InputParameter', {
    //         type: 'atype',
    //         name: 'akey',
    //         value: 'avalue'
    //     });

    //     const inputOutput = moddle.create('camunda:InputOutput', {
    //         inputParameters: [ inputParameter ]
    //     });
    //     const extensionElements = moddle.create( 'bpmn:ExtensionElements', {
    //         values: [ inputOutput ]
    //     } );

    //     // const testProp = new BpmnProperty("camunda:InputOutput", extensionElements);
    //     this.bpmnModeler.get("modeling").updateProperties(this.bpmnElement, {
    //         extensionElements: extensionElements
    //     } );
    //     // End of property adding

    ngOnChanges(changes: SimpleChanges): void {

        // switch (this.bpmnElement?.type) {
        // case "bpmn:Process":
        //     this.propertyController = new ProcessPropertyBuilder();
        //     break;
        // case "bpmn:UserTask":
        //     this.propertyController = new UserTaskPropertyBuilder();
        //     break;
        // case "bpmn:SequenceFlow":
        //     this.propertyController = new FlowPropertyBuilder();
        //     break;
        // case "bpmn:ServiceTask":
        //     this.propertyController = new SkillTaskPropertyBuilder(this.skillService, this.form);
        //     break;
        // default:
        //     this.propertyController = new PropertyBuilder();
        //     break;
        // }

        // this.propertyGroups = this.propertyController.createPropertyGroups(this.bpmnElement);

    }

    /**
     * Event handling function that gets called by the child BPMN property groups on every form change in order to propagate the changes to the BPMN data model
     * @param newProperty The new property that will be set on the model
     */
    onPropertyGroupChanged(newProperty: BpmnProperty): void {
        this.dataModel.updateProperty(this.bpmnElement, newProperty);
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

class CamundaInputParameter {
    $type = "camunda:InputParameter";
    name: string;
    value: string | number | boolean | {}
}
