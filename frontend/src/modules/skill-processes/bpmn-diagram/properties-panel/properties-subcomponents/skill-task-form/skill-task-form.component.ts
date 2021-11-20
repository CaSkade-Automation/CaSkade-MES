import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Skill } from '@shared/models/skill/Skill';
import { Isa88CommandTypeIri } from '@shared/models/state-machine/ISA88/ISA88CommandTypeIri';
import { SkillService } from '../../../../../../shared/services/skill.service';
import { debounceTime } from 'rxjs/operators';
import { SkillVariable } from '@shared/models/skill/SkillVariable';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { BpmnProperty } from '../../../BpmnDataModel';
import { BpmnExtensionElementService } from '../../bpmn-extension-element.service';

@Component({
    selector: 'skill-task-form',
    templateUrl: './skill-task-form.component.html',
    styleUrls: ['./skill-task-form.component.scss']
})
export class SkillTaskFormComponent implements OnInit {
    @Input() bpmnElement;

    // Definition of the FormGroup
    fg = new FormGroup({
        skillIri: new FormControl(),
        commandTypeIri: new FormControl(Isa88CommandTypeIri.Start),
        parameters: new FormGroup({}),
        isSelfResetting: new FormControl(true),
    });

    skills: Skill[];						// List of all skills
    selectedSkill: Skill;                   // The currently selected skill (for form generation)

    existingParameters: SkillVariable[];

    commands = Isa88CommandTypeIri;
    commandKeys;

    @Output() basePropertyUpdated = new EventEmitter<BpmnProperty>();

    constructor(
        private skillService: SkillService,
        private extensionElementService: BpmnExtensionElementService
    ) {
        this.commandKeys = Object.keys(Isa88CommandTypeIri);
    }


    ngOnInit(): void {
        // Set execution class as this is always the same
        const delegateClassProperty = new BpmnProperty("camunda:class", "de.hsuhh.aut.skills.bpmn.delegates.MyJavaDelegate");
        this.basePropertyUpdated.emit(delegateClassProperty);


        // Load all skills, set the first one as selected and get parameters of the selection
        this.skillService.getAllSkills().subscribe(skills => {
            this.skills = skills;
            this.fg.controls.skillIri.setValue(skills[0].iri);
            this.setupParameterForm(this.fg.controls.skillIri.value);
        });

        // Make sure parameter form matches skill
        this.synchronizeParameterForm();

        // Get current input values from the model to populate form fields in the element alraedy has a value
        try {
            const inputs = this.extensionElementService.getInputParameters();
            const executionRequest = JSON.parse(inputs.find(input => input.name == "executionRequest").value as string) as SkillExecutionRequestDto;
            // try to set the values
            this.fg.controls.skillIri.setValue(executionRequest.skillIri);
            this.fg.controls.commandTypeIri.setValue(executionRequest.commandTypeIri);
            this.existingParameters = executionRequest.parameters;
            const isSelfResetting = inputs.find(input => input.name == "isSelfResetting").value as boolean;
            this.fg.controls.isSelfResetting.setValue(isSelfResetting);
        } catch (error) {

        }

        // Get the current form values and store them in the process
        this.syncFormValuesAndProcess();
    }

    /**
     * Dynamically sets up a FormGroup for the parameters of a skill
     * @param skillIri IRI of the skill that parameters will be setup for
     */
    setupParameterForm(skillIri: string): void {
        // If no skillIri is given, no parameters can be set
        if (!skillIri) return;

        this.selectedSkill = this.skills.find(sk => sk.iri == skillIri);
        this.selectedSkill.skillParameters.forEach(param => {
            let existingValue = "";
            try {
                existingValue = this.existingParameters.find(exParam => exParam.name == param.name).value;
            } catch (err) {

            }
            this.fgParameters.addControl(param.name, new FormControl(existingValue));
        });
    }


    /**
	 * Makes sure that parameters always match to the current skill selection
	 */
    private synchronizeParameterForm(): void {
        this.fg.controls.skillIri.valueChanges.subscribe(skillIri => {
            this.setupParameterForm(skillIri);
        });
    }


    /**
	 * Subscribe to the form values and synchronize them with the process
	 */
    private syncFormValuesAndProcess(): void {
        this.fg.valueChanges.pipe(debounceTime(100)).subscribe(data => {
            // Fill in parameter values and create an executionRequest
            const paramsWithValues = this.selectedSkill.skillParameters.map(param => {
                param.value = data.parameters[param.name];
                return param;
            });
            const executionRequest = new SkillExecutionRequestDto(data.skillIri, data.commandTypeIri, paramsWithValues);

            this.extensionElementService.addCamundaInputParameter(new BpmnProperty("executionRequest", executionRequest));
            const isSelfResetting = data.isSelfResetting;
            this.extensionElementService.addCamundaInputParameter(new BpmnProperty("isSelfResetting", isSelfResetting));
        });
    }


    /**
	 * Convenience getter that simplifies getting the parameter sub-FormGroup
	 */
    get fgParameters(): FormGroup {
        return this.fg.controls.parameters as FormGroup;
    }

}
