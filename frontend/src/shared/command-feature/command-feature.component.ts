import { Component, OnInit, Input } from '@angular/core';
import { Skill } from '../../../../shared/models/skill/Skill';
import { Transition } from '../../../../shared/models/state-machine/Transition';
import { SkillParameter } from '@shared/models/skill/SkillParameter';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { SkillExecutionService } from '../services/skill-execution.service';
import { SkillExecutionRequest, SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';




@Component({
    selector: 'app-command-feature',
    templateUrl: './command-feature.component.html',
    styleUrls: ['./command-feature.component.scss']
})
export class CommandFeatureComponent implements OnInit {
  @Input() skill: Skill;

  constructor(
      private skillExecutionService: SkillExecutionService


  ) {}
request: SkillExecutionRequestDto;
 parameterSettings= new Array<any>();
 command: Transition;

 ngOnInit() {

 }
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

 isActiveCommand(currentCommand: Transition, skill: Skill) {
     return skill.stateMachine.getActiveCommands().some(command => command.iri == currentCommand.iri);
 }

 getShortName(command: Transition): string{
     let name = command.iri.split("#")[1];
     name = name.split("_")[0];
     return name;
 }

 getSteps(parameter: SkillParameter){
     switch(parameter.type){
     case "float": return "any";
     case "int": return "1";
     }
 }
 getDefault(parameter: SkillParameter){
     if (parameter.default== undefined) {
         return "";
     } else {
         return parameter.default;
     }
 }

 executeSkill(command: Transition) {
     console.log(command.iri) ;
     const newRequest= new SkillExecutionRequestDto;
     newRequest.commandTypeIri=command.iri;
     newRequest.parameters=this.skill.skillParameters;
     newRequest.skillIri=this.skill.iri;
     this.skillExecutionService.executeService(newRequest).subscribe(data => console.log(data));
     console.log(newRequest);

     this.command=command;


 }

 setParameters(){
     this.parameterSettings=this.skill.skillParameters;
     const parameterDtos = this.skill.skillParameters.map(parameter =>  parameter.toSkillParameterDto());
     this.skillExecutionService.setParameters(this.skill.iri, parameterDtos).subscribe(data => console.log(data));
 }

}
