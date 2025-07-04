import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Isa88CommandTypeIri } from '@shared/models/state-machine/ISA88/ISA88CommandTypeIri';
import { BehaviorSubject, combineLatest, debounceTime, firstValueFrom, Observable, Subscription, tap, withLatestFrom } from 'rxjs';
import { ExpressionGoal, PropertyDto, PropertyInstanceDto } from '@shared/models/properties/PropertyDto';
import { BpmnTaskCapability, BpmnTaskCapabilityDTO } from '../../../../../../../../shared/models/BpmnTaskCapability';
import { Capability } from '../../../../../../../../shared/models/Capability';
import { Property, PropertyInstance } from '../../../../../../../../shared/models/Property';
import { CapabilityService } from '../../../../../../../../shared/services/capability.service';
import { BpmnElement, BpmnProperty } from '../../../../../BpmnDataModel';
import { BpmnExtensionElementService } from '../../../../bpmn-extension-element.service';

@Component({
    selector: 'capability-task-form',
    templateUrl: './capability-task-form.component.html',
    styleUrls: ['./capability-task-form.component.scss']
})
export class CapabilityTaskFormComponent implements OnInit {

    @Input() bpmnElement$: Observable<BpmnElement>;

    capabilities$: Observable<Capability[]>;
    selectedCapability$ = new BehaviorSubject<Capability>(null);                   // The currently selected capability (for form generation)
    existingPropertyInstances: PropertyInstance[];

    // Definition of the FormGroup
    fg = new FormGroup({
        capabilityIri: new FormControl(),
        commandTypeIri: new FormControl(Isa88CommandTypeIri.Start),
        properties: new FormGroup({}),
        selfResetting: new FormControl(true),
    });

    commands = Isa88CommandTypeIri;
    commandKeys;

    constructor(
        private capabilityService: CapabilityService,
        private extensionElementService: BpmnExtensionElementService
    ) {
        this.commandKeys = Object.keys(Isa88CommandTypeIri);
    }

    ngOnInit() {
        this.capabilities$ = this.capabilityService.getCapabilities();
        this.handleCapabilitySelection();
    }

    handleCapabilitySelection(): void {
        this.fg.controls.capabilityIri.valueChanges.pipe(debounceTime(100), withLatestFrom(this.capabilities$)).subscribe(([capabilityIri, capabilities]) => {
            const selectedCapability = capabilities.find(cap =>cap.iri === capabilityIri);
            this.selectedCapability$.next(selectedCapability);
            console.log(this.selectedCapability$.value);

        });
    }

    /**
     * Dynamically sets up a FormGroup for the parameters of a skill
     * @param skillIri IRI of the skill that parameters will be setup for
     */
    updateForm(): void {
        console.log("update");

        combineLatest([this.bpmnElement$, this.capabilities$]).subscribe(([bpmnElement, capabilities]) => {

            // Clear the fg in case of switch between different skill tasks
            this.fg.reset();

            // Get current input values from the model to populate form fields if the element already has a value
            let commandTypeIri: string;
            let selfResetting: boolean;
            try {
                const inputs = this.extensionElementService.getInputParameters();
                const serializedTaskCapability = JSON.parse(inputs.find(input => input.name == "capability").value as string) as BpmnTaskCapabilityDTO;
                const taskCapability = new BpmnTaskCapability(serializedTaskCapability);

                console.log(taskCapability);

                // try to set the values
                const matchingCapability = capabilities.find(cap => cap.iri === taskCapability.capabilityIri);
                this.selectedCapability$.next(matchingCapability);
                commandTypeIri = taskCapability.commandTypeIri;
                this.existingPropertyInstances = taskCapability.propertyInstances;
                selfResetting = taskCapability.selfResetting;

            } catch (error) {
            // if no capability is stored in the current task
                this.selectedCapability$.next(capabilities[0]);
                commandTypeIri = Isa88CommandTypeIri.Start;
                selfResetting = true;
            }

            this.fg.controls.capabilityIri.setValue(this.selectedCapability$.value.iri);
            this.fg.controls.commandTypeIri.setValue(Isa88CommandTypeIri[commandTypeIri]);
            this.fg.controls.selfResetting.setValue(selfResetting);

            // Make sure parameter form matches skill and that outputs of skill are added as task outputs
            this.setupPropertyForm(this.selectedCapability$.value);
            this.setOutputs(bpmnElement, this.selectedCapability$.value);
            this.syncFormValuesAndProcess();
        });
    }


    setupPropertyForm(newCapability: Capability): void {
        // Filter only actual values as these are the property instances that will be set. Requirements are just used for constraints
        const actualValueInputs = this.getUnboundProperty();
        actualValueInputs.forEach(prop => {
            let existingValue = "";
            try {
                existingValue = this.existingPropertyInstances.find(exProp => exProp.getLocalName() == prop.getLocalName()).value;
                const formControl = this.fgProperties as FormGroup;
                const form = formControl.get(prop.getLocalName());
                this.fgProperties.controls[prop.getLocalName()].setValue(existingValue);
            } catch (err) {

            }
            this.fgProperties.addControl(prop.getLocalName(), new FormControl(existingValue));
        });
    }

    private setOutputs(bpmnElement: any, selectedCapability: Capability): void {
        const bpmnOutputProperties = selectedCapability.outputProperties.map(output => {
            const outputName = `${bpmnElement.id}_${output.getLocalName()}`;
            const outputValue = "${" + outputName + "}";
            return new BpmnProperty(outputName, outputValue);
        });
        this.extensionElementService.setCamundaOutputParameters(bpmnOutputProperties);
    }


    /**
	 * Subscribe to the form values and synchronize them with the process
	 */
    private syncFormValuesAndProcess(): Subscription {
        return this.fg.valueChanges.pipe(debounceTime(100)).subscribe(data => {
            // Fill in parameter values and create an executionRequest
            const propertyInstances = new Array<PropertyInstanceDto>();
            this.getUnboundProperty().forEach(prop => {
                const propInstance: PropertyInstanceDto = {
                    logicInterpretation: "=",
                    expressionGoal: ExpressionGoal.None,
                    propertyInstanceIri: `${prop.iri}_processValue`,
                    value: data.properties[prop.getLocalName()]
                };
                propertyInstances.push(propInstance);
            });
            const taskCapabilityDto = new BpmnTaskCapabilityDTO(data.capabilityIri, data.commandTypeIri, data.selfResetting, propertyInstances);

            this.extensionElementService.addCamundaInputParameter(new BpmnProperty("capability", taskCapabilityDto));
        });
    }


    /**
	 * Convenience getter that simplifies getting the parameter sub-FormGroup
	 */
    get fgProperties(): FormGroup {
        return this.fg.controls.properties as FormGroup;
    }


    /**
     * Filter input properties for those that have an unbound instance description, i.e. one that allows to set values
     * Requirements and Assurances are used for constraints only and are thus not considered here.
     * @returns An array of input properties that allow for setting values
     */
    getUnboundProperty(): Array<Property>{
        const selectedCapability = this.selectedCapability$.value;
        if(!selectedCapability) return [];


        console.log("sel cap");
        console.log(selectedCapability);
        console.log(selectedCapability.inputProperties);



        const properties = selectedCapability?.inputProperties.filter(inputProp => inputProp.instances.some(instance => (!instance.expressionGoal) ));
        console.log(properties);

        return properties;
    }

}
