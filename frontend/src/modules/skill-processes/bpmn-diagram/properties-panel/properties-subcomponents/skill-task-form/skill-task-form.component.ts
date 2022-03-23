import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Skill } from '@shared/models/skill/Skill';
import { Isa88CommandTypeIri } from '@shared/models/state-machine/ISA88/ISA88CommandTypeIri';
import { SkillService } from '../../../../../../shared/services/skill.service';
import { debounceTime, take } from 'rxjs/operators';
import { SkillVariable } from '@shared/models/skill/SkillVariable';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { BpmnProperty } from '../../../BpmnDataModel';
import { BpmnExtensionElementService } from '../../bpmn-extension-element.service';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
    selector: 'skill-task-form',
    templateUrl: './skill-task-form.component.html',
    styleUrls: ['./skill-task-form.component.scss']
})
export class SkillTaskFormComponent implements OnInit {
    _bpmnElement;

    // Definition of the FormGroup
    fg = new FormGroup({
        skillIri: new FormControl(),
        commandTypeIri: new FormControl(Isa88CommandTypeIri.Start),
        parameters: new FormGroup({}),
        selfResetting: new FormControl(true),
    });

    skills: Skill[];						// List of all skills
    selectedSkill: Skill;                   // The currently selected skill (for form generation)

    existingParameters: SkillVariable[];

    commands = Isa88CommandTypeIri;
    commandKeys;

    $inoutSub: Subscription;
    $valueSub: Subscription;

    constructor(
        private skillService: SkillService,
        private extensionElementService: BpmnExtensionElementService
    ) {
        this.commandKeys = Object.keys(Isa88CommandTypeIri);
    }

    ngOnInit(): void {
        // Set execution class as this is always the same
        const delegateClassProperty = new BpmnProperty("camunda:class", "de.hsuhh.aut.skills.bpmn.delegates.SkillExecutor");
        this.extensionElementService.updateBaseProperty(delegateClassProperty);

        // console.log("on init");

        // this.updateForm();

        // Get the current form values and store them in the process
        // this.syncFormValuesAndProcess();
    }

    /**
     * Dynamically sets up a FormGroup for the parameters of a skill
     * @param skillIri IRI of the skill that parameters will be setup for
     */
    async updateForm(): Promise<void> {
        // Clear the fg in case of switch between different skill tasks
        this.fg.reset();

        this.skills = await firstValueFrom(this.skillService.getAllSkills());

        // Get current input values from the model to populate form fields in the element alraedy has a value
        let commandTypeIri: string;
        let selfResetting: boolean;
        try {
            const inputs = this.extensionElementService.getInputParameters();
            const executionRequest = JSON.parse(inputs.find(input => input.name == "executionRequest").value as string) as SkillExecutionRequestDto;
            // try to set the values
            this.selectedSkill = this.skills.find(skill => skill.iri === executionRequest.skillIri);

            commandTypeIri = executionRequest.commandTypeIri;
            this.existingParameters = executionRequest.parameters;

            selfResetting = inputs.find(input => input.name == "selfResetting").value as boolean;
        } catch (error) {

            // if no executionrequest exists
            this.selectedSkill = this.skills[0];
            commandTypeIri = Isa88CommandTypeIri.Start;
            selfResetting = true;
        }

        this.fg.controls.skillIri.setValue(this.selectedSkill.iri);
        this.fg.controls.commandTypeIri.setValue(commandTypeIri);
        this.fg.controls.selfResetting.setValue(selfResetting);

        // Make sure parameter form matches skill and that outputs of skill are added as task outputs
        this.setupParameterForm();
        this.setOutputs();
        this.$inoutSub = this.synchronizeInputsAndOutputs();
        this.$valueSub = this.syncFormValuesAndProcess();
    }


    setupParameterForm(): void {

        this.selectedSkill.skillParameters.forEach(param => {
            let existingValue = "";
            try {
                existingValue = this.existingParameters.find(exParam => exParam.name == param.name).value;
                this.fgParameters.controls[param.name].setValue(existingValue);
            } catch (err) {

            }
            this.fgParameters.addControl(param.name, new FormControl(existingValue));
        });
    }

    /**
	 * Makes sure that parameters always match to the current skill selection
	 */
    private synchronizeInputsAndOutputs(): Subscription {
        return this.fg.controls.skillIri.valueChanges.subscribe(skillIri => {
            this.selectedSkill = this.skills.find(sk => sk.iri == skillIri);
            // If no skillIri is given, nothing can be done
            console.log("in synch");
            console.log(this.selectedSkill);


            if (!this.selectedSkill) return;

            this.setupParameterForm();
            this.setOutputs();
        });
    }

    private setOutputs(): void {
        const bpmnOutputProperties = this.selectedSkill.skillOutputs.map(output => {
            const outputName = `${this._bpmnElement.id}_${output.name}`;
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
            // Change selected skill
            // this.selectedSkill = data.skill;
            console.log(data);


            // Fill in parameter values and create an executionRequest
            const paramsWithValues = this.selectedSkill.skillParameters.map(param => {
                param.value = data.parameters[param.name];
                return param;
            });
            const executionRequest = new SkillExecutionRequestDto(data.skillIri, data.commandTypeIri, paramsWithValues, data.selfResetting);

            this.extensionElementService.addCamundaInputParameter(new BpmnProperty("executionRequest", executionRequest));
        });
    }

    // Big TODO, continue here: On resetting, the skill of the XML should be set. Only if none exists should skills [0] be set

    @Input()
    set bpmnElement(elem: any) {
        // kill existing subscriptions
        try {
            this.$inoutSub.unsubscribe();
            this.$valueSub.unsubscribe();
        } catch (error) {
            // If there are no subscriptions, they cant be cancelled and thats fine -> nothing to do here
        }

        this._bpmnElement = elem;
        this.updateForm();
        // this.selectedSkill = this.skills[0];
        // this.fg.controls.skillIri.setValue(this.selectedSkill.iri);
        // this.updateForm();
        // // Make sure parameter form matches skill and that outputs of skill are added as task outputs
        // this.synchronizeParameterFormAndOutputs();
        // this.setOutputs();
    }

    /**
	 * Convenience getter that simplifies getting the parameter sub-FormGroup
	 */
    get fgParameters(): FormGroup {
        return this.fg.controls.parameters as FormGroup;
    }

}
