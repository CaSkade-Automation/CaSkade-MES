import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Isa88CommandTypeIri } from '@shared/models/state-machine/ISA88/ISA88CommandTypeIri';
import { combineLatest, debounceTime, firstValueFrom, Observable, Subscription, tap } from 'rxjs';
import { ExpressionGoal } from '@shared/models/properties/PropertyDTO';
import { BpmnTaskCapability, BpmnTaskCapabilityDTO } from '../../../../../../../../shared/models/BpmnTaskCapability';
import { Capability } from '../../../../../../../../shared/models/Capability';
import { Property } from '../../../../../../../../shared/models/Property';
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
    selectedCapability: Capability;
    existingProperties: Property[];

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
    }

    /**
     * Dynamically sets up a FormGroup for the parameters of a skill
     * @param skillIri IRI of the skill that parameters will be setup for
     */
    updateForm(): void {

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


                // try to set the values
                this.selectedCapability = capabilities.find(cap => cap.iri === taskCapability.capabilityIri);
                commandTypeIri = taskCapability.commandTypeIri;
                this.existingProperties = taskCapability.properties;
                selfResetting = taskCapability.selfResetting;

            } catch (error) {
            // if no capability is stored in the current task
                this.selectedCapability = capabilities[0];
                commandTypeIri = Isa88CommandTypeIri.Start;
                selfResetting = true;
            }

            this.fg.controls.capabilityIri.setValue(this.selectedCapability.iri);
            this.fg.controls.commandTypeIri.setValue(Isa88CommandTypeIri[commandTypeIri]);
            this.fg.controls.selfResetting.setValue(selfResetting);

            // Make sure parameter form matches skill and that outputs of skill are added as task outputs
            this.setupPropertyForm(this.selectedCapability);
            this.setOutputs(bpmnElement, this.selectedCapability);
            this.syncFormValuesAndProcess();
        });
    }


    setupPropertyForm(newCapability: Capability): void {
        // Filter only actual values as these are the property instances that will be set. Requirements are just used for constraints
        const actualValueInputs = this.getActualValueInputProperties();
        actualValueInputs.forEach(prop => {
            let existingValue = "";
            try {
                existingValue = this.existingProperties.find(exProp => exProp.getLocalName() == prop.getLocalName()).value;
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
            const propertiesWithValues = this.getActualValueInputProperties().map(prop => {
                prop.value = data.properties[prop.getLocalName()];
                return prop.toDto();
            });
            const taskCapabilityDto = new BpmnTaskCapabilityDTO(data.capabilityIri, data.commandTypeIri, data.selfResetting, propertiesWithValues);

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
     * Filter input properties for expression goal "Actual_Value". Only these properties need to be filled.
     * Requirements and Assurances are used for constraints only
     * @returns An array of input properties with expression goal "Actual_Value"
     */
    getActualValueInputProperties(): Array<Property>{
        return this.selectedCapability?.inputProperties.filter(inputProp => inputProp.expressionGoal == ExpressionGoal.Actual_Value);
    }

}
