import { Component, OnInit } from '@angular/core';
import { SkillService } from 'src/shared/services/skill.service';
//import { Skill } from 'src/shared/models/module';
import { ModuleService } from 'src/shared/services/module.service';
import { Skill } from '../../../../shared/models/skill/Skill';
import { Transition } from '../../../../shared/models/state-machine/Transition';


@Component({
    selector: 'app-skill-overview',
    templateUrl: './skill-overview.component.html',
    styleUrls: ['./skill-overview.component.scss']
})
export class SkillOverviewComponent implements OnInit {

    constructor(
    private skillService: SkillService,
    private moduleService: ModuleService
    ) {}
  skills= new Array<Skill>();

  ngOnInit() {
      console.log("init");
      this.skillService.getAllSkills().subscribe((skills: Skill[]) =>{
          this.skills=skills;
      });

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
}
