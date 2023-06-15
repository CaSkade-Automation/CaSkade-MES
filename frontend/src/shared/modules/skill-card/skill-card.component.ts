import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transition } from '@shared/models/state-machine/Transition';
import { SkillVariable, SkillVariableDto } from '@shared/models/skill/SkillVariable';
import { SkillExecutionService } from '../../services/skill-execution.service';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { SkillService } from '../../services/skill.service';
import { take } from 'rxjs/operators';
import { SkillSocketService } from '../../services/sockets/skill-socket.service';
import { StateChangeInfo } from '@shared/models/socket-communication/SocketData';
import { Skill } from '../../models/Skill';


@Component({
    selector: 'skill-card',
    templateUrl: './skill-card.component.html',
    styleUrls: ['./skill-card.component.scss']
})
export class SkillCardComponent implements OnInit {

    @Input() skill: Skill;
    @Output("onSkillDeleted") onSkillDeleted = new EventEmitter<string>();

    request: SkillExecutionRequestDto;
    parameterSettings= new Array<any>();
    transitionTriggered = false;
    command: Transition;
    blinkStateChange = false;

    constructor(
        private skillExecutionService: SkillExecutionService,
        private skillSocket: SkillSocketService,
        private skillService: SkillService
    ) {}

    ngOnInit(): void {
        this.skillSocket.onSkillStateChanged(this.skill.iri).subscribe((val: StateChangeInfo) => {
            this.skill.stateMachine.setCurrentState(val.newStateTypeIri);
            this.blinkStateChange = true;
            setTimeout(() => {
                this.blinkStateChange = false;
            }, 1000);
        });
    }



    getCommandButtonClass(command: Transition): string {
        const commandName = command.getLocalName();
        switch (commandName) {
        case "StartCommand":
        case "UnholdCommand":
        case "UnsuspendCommand":
        case "ResetCommand":
            return "btn-success";
        case "ClearCommand":
            return "btn-secondary";
        case "SuspendCommand":
        case "HoldCommand":
            return "btn-secondary";
        case "AbortCommand":
        case "StopCommand":
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
        this.skillExecutionService.executeService(newRequest).pipe(take(1)).subscribe();

        this.command = command;
    }

    getSkillOutputs(): void {
        const request= new SkillExecutionRequestDto(this.skill.iri, "http://www.w3id.org/hsu-aut/cask#GetOutputs");
        this.skillExecutionService.executeService(request).subscribe((data: SkillVariableDto[]) => {
            data.forEach(element => {
                const skillOutput = this.skill.skillOutputs.find(output => output.name == element.name);
                skillOutput.value = element.value;
            });
        });
    }

    setParameters(): void{
        this.parameterSettings=this.skill.skillParameters;
        const parameterDtos = this.skill.skillParameters.map(parameter =>  parameter.toSkillVariableDto());
        this.skillExecutionService.setParameters(this.skill.iri, parameterDtos).pipe(take(1)).subscribe();
    }


    deleteSkill(): void {
        this.skillService.deleteSkill(this.skill.iri).subscribe();
        this.onSkillDeleted.emit(this.skill.iri);
    }

}
