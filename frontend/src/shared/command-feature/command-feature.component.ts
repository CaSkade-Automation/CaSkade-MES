import { Component, OnInit, Input } from '@angular/core';
import { Skill } from '../../../../shared/models/skill/Skill';
import { Transition } from '../../../../shared/models/state-machine/Transition';



@Component({
    selector: 'app-command-feature',
    templateUrl: './command-feature.component.html',
    styleUrls: ['./command-feature.component.scss']
})
export class CommandFeatureComponent implements OnInit {
  @Input() skill: Skill;

  constructor() { }

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
}
