import { Component, Input } from '@angular/core';
import { Skill } from '@shared/models/skill/Skill';
import { Transition } from '@shared/models/state-machine/Transition';
import { SkillVariable, SkillVariableDto } from '@shared/models/skill/SkillVariable';
import { SkillExecutionService } from '../services/skill-execution.service';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { SkillService } from '../services/skill.service';




@Component({
    selector: 'app-command-feature',
    templateUrl: './command-feature.component.html',
    styleUrls: ['./command-feature.component.scss']
})
export class CommandFeatureComponent {
    @Input() skill: Skill;

    request: SkillExecutionRequestDto;
    parameterSettings= new Array<any>();
    transitionTriggered = false;
    command: Transition;

    constructor(
        private skillExecutionService: SkillExecutionService,
        private skillService: SkillService
    ) {}



    getCommandButtonClass(command: Transition) {
        const commandName = command.getLocalName();
        switch (commandName) {
        case "Start_Command":
        case "Un-Hold_Command":
        case "Unsuspend_Command":
        case "Reset_Command":
            return "btn-success";
        case "Clear_Command":
            return "btn-secondary";
        case "Suspend_Command":
        case "Hold_Command":
            return "btn-dark";
        case "Abort_Command":
        case "Stop_Command":
            return "btn-danger";
        }
    }

    isActiveCommand(currentCommand: Transition, skill: Skill): boolean {
        return skill.stateMachine.getActiveCommands().some(command => command.iri == currentCommand.iri);
    }


    getSteps(parameter: SkillVariable){
        switch(parameter.type){
        case "float": return "any";
        case "int": return "1";
        }
    }
    getDefault(parameter: SkillVariable): any{
        if (parameter.default== undefined) {
            return "";
        } else {
            return parameter.default;
        }
    }

    executeSkill(command: Transition): void {
        this.transitionTriggered = true;
        const newRequest= new SkillExecutionRequestDto(this.skill.iri, command.iri, this.skill.skillParameters);
        newRequest.parameters=this.skill.skillParameters;
        newRequest.skillIri=this.skill.iri;
        this.skillExecutionService.executeService(newRequest).subscribe(data => console.log(data));

        this.command = command;
    }

    getSkillOutputs(): void {
        const request= new SkillExecutionRequestDto(this.skill.iri, "http://www.hsu-ifa.de/ontologies/capability-model#GetOutputs");
        this.skillExecutionService.executeService(request).subscribe((data: SkillVariableDto[]) => {
            data.forEach(element => {
                const skillOutput = this.skill.skillOutputs.find(output => output.name == element.name);
                skillOutput.value = element.value;
            });
        });
    }

    setParameters(): void{
        this.parameterSettings=this.skill.skillParameters;
        const parameterDtos = this.skill.skillParameters.map(parameter =>  parameter.toSkillParameterDto());
        this.skillExecutionService.setParameters(this.skill.iri, parameterDtos).subscribe(data => console.log(data));
    }


    deleteSkill(): void {
        this.skillService.deleteSkill(this.skill.iri).subscribe();
    }

}
