import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Isa88CommandTypeIri } from '@shared/models/state-machine/ISA88/ISA88CommandTypeIri';
import { SkillService } from '../../../../../../../../shared/services/skill.service';
import { debounceTime, filter, find, take, tap, withLatestFrom } from 'rxjs/operators';
import { SkillVariable } from '@shared/models/skill/SkillVariable';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { BpmnElement, BpmnProperty } from '../../../../../BpmnDataModel';
import { BpmnExtensionElementService } from '../../../../bpmn-extension-element.service';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable, Subscription } from 'rxjs';
import { Skill } from '../../../../../../../../shared/models/Skill';

@Component({
    selector: 'skill-task-form',
    templateUrl: './skill-task-form.component.html',
    styleUrls: ['./skill-task-form.component.scss']
})
export class SkillTaskFormComponent implements OnInit {

    @Input() bpmnElement$: Observable<BpmnElement>;
    serviceTaskElement$: Observable<BpmnElement>; // Filtered observable only holding serviceTasks

    // Definition of the FormGroup
    fg = new FormGroup({
        skillIri: new FormControl(),
        commandTypeIri: new FormControl(Isa88CommandTypeIri.Start),
        parameters: new FormGroup({}),
        selfResetting: new FormControl(true),
    });

    skills$: Observable<Skill[]>;						// List of all skills
    selectedSkill$ = new BehaviorSubject<Skill>(null);                   // The currently selected skill (for form generation)

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
        this.skills$ = this.skillService.getSkills();
        this.serviceTaskElement$ = this.bpmnElement$.pipe(filter(bpmnElement => bpmnElement.type == "bpmn:ServiceTask"));
        // Set execution class as this is always the same
        const delegateClassProperty = new BpmnProperty("camunda:class", "de.hsuhh.aut.skills.bpmn.delegates.SkillExecutor");
        this.extensionElementService.updateBaseProperty(delegateClassProperty);
        this.handleElementChanges();
        // Make sure parameter form matches skill and that outputs of skill are added as task outputs
        this.handleSkillSelection();
        this.setupParameterForm();
        this.setOutputs();
    }


    handleSkillSelection(): void {
        this.fg.controls.skillIri.valueChanges.pipe(debounceTime(100), withLatestFrom(this.skills$)).subscribe(([skillIri, skills]) => {
            const selectedSkill = skills.find(skill =>skill.iri === skillIri);
            this.selectedSkill$.next(selectedSkill);
        });
    }

    /**
     * Dynamically sets up a FormGroup for the parameters of a skill
     * @param skillIri IRI of the skill that parameters will be setup for
     */
    handleElementChanges(): void {
        console.log("handling changes");

        this.serviceTaskElement$.pipe(withLatestFrom(this.skills$)).subscribe(([bpmnElement, skills]) => {
            console.log("doing form");

            // Clear the fg in case of switch between different skill tasks
            this.fg.reset();

            // Get current input values from the model to populate form fields in the element alraedy has a value
            const inputs = this.extensionElementService.getInputParameters() ?? [];
            const executionRequestString = (inputs.find(input => input.name == "executionRequest")?.value as string) ?? "{}";
            const executionRequest = JSON.parse(executionRequestString) as SkillExecutionRequestDto;
            // try to set the values
            const matchingSkill = skills.find(skill =>skill.iri === executionRequest.skillIri) ?? skills[0];
            this.selectedSkill$.next(matchingSkill);
            console.log("found matching skill" + matchingSkill.iri);


            const commandTypeIri = executionRequest.commandTypeIri as Isa88CommandTypeIri ?? Isa88CommandTypeIri.Start;
            this.existingParameters = executionRequest.parameters;

            const selfResetting = (inputs.find(input => input.name == "selfResetting")?.value as boolean) ?? true;

            this.fg.controls.skillIri.setValue(this.selectedSkill$.getValue().iri);
            this.fg.controls.commandTypeIri.setValue(commandTypeIri);
            this.fg.controls.selfResetting.setValue(selfResetting);

            this.$valueSub = this.syncFormValuesAndProcess();
        });

    }

    private setupParameterForm(): void {
        console.log("setting up parameters");

        this.selectedSkill$.subscribe(selectedSkill => {
            console.log("change to skill");

            selectedSkill.skillParameters.forEach(param => {
                let existingValue = "";
                try {
                    existingValue = this.existingParameters.find(exParam => exParam.name == param.name).value;
                    this.fgParameters.controls[param.name].setValue(existingValue);
                } catch (err) {

                }
                this.fgParameters.addControl(param.name, new FormControl(existingValue));
            });
        });
    }

    private setOutputs(): void {
        console.log("setting outputs");

        combineLatest([this.serviceTaskElement$, this.selectedSkill$]).subscribe(([bpmnElement, selectedSkill]) => {
        // this.selectedSkill$.subscribe(selectedSkill => {
            const bpmnOutputProperties = selectedSkill.skillOutputs.map(output => {
                const outputName = `${bpmnElement.id}_${output.name}`;
                const outputValue = "${" + outputName + "}";
                return new BpmnProperty(outputName, outputValue);
            });
            this.extensionElementService.setCamundaOutputParameters(bpmnOutputProperties);
        });
    }


    /**
	 * Subscribe to the form values and synchronize them with the process
	 */
    private syncFormValuesAndProcess(): Subscription {
        return this.fg.valueChanges.pipe(debounceTime(100)).subscribe((fgValue) => {
            // Fill in parameter values and create an executionRequest
            const paramsWithValues = this.selectedSkill$.getValue().skillParameters.map(param => {
                param.value = fgValue.parameters[param.name];
                return param;
            });
            const executionRequest = new SkillExecutionRequestDto(fgValue.skillIri, fgValue.commandTypeIri, paramsWithValues, fgValue.selfResetting);

            this.extensionElementService.addCamundaInputParameter(new BpmnProperty("executionRequest", executionRequest));
        });
    }

    /**
	 * Convenience getter that simplifies getting the parameter sub-FormGroup
	 */
    get fgParameters(): FormGroup {
        return this.fg.controls.parameters as FormGroup;
    }

}
