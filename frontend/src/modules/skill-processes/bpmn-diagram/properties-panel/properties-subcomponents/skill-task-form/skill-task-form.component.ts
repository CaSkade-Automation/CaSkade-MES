import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Skill } from '@shared/models/skill/Skill';
import { Isa88CommandTypeIri } from '@shared/models/state-machine/ISA88/ISA88CommandTypeIri';
import { SkillService } from '../../../../../../shared/services/skill.service';
import { debounceTime } from 'rxjs/operators';
import { SkillVariable } from '@shared/models/skill/SkillVariable';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { BpmnProperty } from '../../../BpmnDataModel';

@Component({
    selector: 'skill-task-form',
    templateUrl: './skill-task-form.component.html',
    styleUrls: ['./skill-task-form.component.scss']
})
export class SkillTaskFormComponent implements OnInit {
    @Input() bpmnElement;

    // Setup FormGroup
    fg = new FormGroup({
        skillIri: new FormControl(),
        commmandTypeIri: new FormControl(Isa88CommandTypeIri.Start),
        parameters: new FormGroup({}),
        isSelfResetting: new FormControl(true),
    });

    skills: Skill[];
    currentParameters: SkillVariable[];

    commands = Isa88CommandTypeIri;
    commandKeys;

    @Output() addCamundaInput = new EventEmitter<BpmnProperty>();
    @Output() basePropertyUpdated = new EventEmitter<BpmnProperty>();

    constructor(private skillService: SkillService) {
        this.commandKeys = Object.keys(Isa88CommandTypeIri);
    }


    // const skillProperty = new SkillSelectionProperty(
    //     {
    //         key: "skillIri",
    //         label: "The skill that should be executed in this task",
    //         order: 3,
    //         required: true,
    //         value: ''
    //     }, this.skillService
    // );

    // const commandTypeProperty = new CommandTypeSelectionProperty(
    //     {
    //         key: "commandTypeIri",
    //         label: "The command type of the skill that should be executed in this task",
    //         order: 4,
    //         required: true,
    //         value: ''
    //     }
    // );

    // // TODO: This has to be checked and properly set up. Adding Camunda extension elements is not that easy.
    // const skillPropertyGroup = new BpmnPropertyGroup("skill", [skillProperty, commandTypeProperty]);

    // const parameterProperty =  new ParameterSelectionProperty(
    //     {
    //         key: "parameter",
    //         label: "The parameters of this task",
    //         order: 4,
    //         required: true,
    //         value: ''
    //     },
    //     this.skillService,
    //     this.skilFormControl
    // );

    // const delegateClassProperty = new ReadonlyInputProperty(
    //     {
    //         key: "camunda:class",
    //         label: "The Java delegate class that is in charge of executing this service task",
    //         order: 10,
    //         required: false,
    //         value: 'de.hsuhh.aut.skills.bpmn.delegates.MyJavaDelegate;',
    //         hidden: true
    //     }
    // );

    ngOnInit() {
        // Set execution class as this is always the same
        const delegateClassProperty = new BpmnProperty("camunda:class", "de.hsuhh.aut.skills.bpmn.delegates.MyJavaDelegate");
        this.basePropertyUpdated.emit(delegateClassProperty);

        // TODO: Get current input values from the model to populate form fields in the element alraedy has a value

        // Load all skills, set the first one as selected and get parameters of the selection
        this.skillService.getAllSkills().subscribe(skills => {
            this.skills = skills;
            this.fg.controls.skillIri.setValue(skills[0].iri);
            this.setupParameterForm(this.fg.controls.skillIri.value);
        });

        this.fg.controls.skillIri.valueChanges.subscribe(skillIri => {
            this.setupParameterForm(skillIri);
        });

        // Get the current form values and create the object to be stored in the process
        this.fg.valueChanges.pipe(debounceTime(100)).subscribe(data => {
            const paramsWithValues = this.currentParameters.map(param => {
                param.value = data.parameters[param.name];
                return param;
            });

            const executionRequest = new SkillExecutionRequestDto(data.skillIri, data.commandTypeIri, paramsWithValues);
            this.addCamundaInput.emit(new BpmnProperty("executionRequest", executionRequest));
            const isSelfResetting = data.isSelfResetting;
            this.addCamundaInput.emit(new BpmnProperty("isSelfResetting", isSelfResetting));
        });
    }

    /**
     * Dynamically sets up a FormGroup for the parameters of a skill
     * @param skillIri IRI of the skill that parameters will be setup for
     */
    setupParameterForm(skillIri: string): void {
        // If no skillIri is given, no parameters can be set
        if (!skillIri) return;

        const skill = this.skills.find(sk => sk.iri == skillIri);
        this.currentParameters = skill.skillParameters;
        skill.skillParameters.forEach(param => {
            this.fgParameters.addControl(param.name, new FormControl());
        });
    }

    get fgParameters(): FormGroup {
        return this.fg.controls.parameters as FormGroup;
    }

}
