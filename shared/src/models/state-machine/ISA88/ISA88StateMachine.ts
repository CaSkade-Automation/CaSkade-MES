import { Command } from "../Command";
import { State } from "../State";
import { StateMachine } from "../StateMachine";

export class Isa88StateMachine extends StateMachine {

    states: State[];
    commands: Command[];

    getCommands(): Command[] {
        return this.commands;
    }

    getActiveCommands(): Command[] {
        return this.currentState.getActiveCommands();
    }

    getStates(): State[] {
        return this.states;
    }

    setCommands(commands: Command[]): void {
        this.commands = commands;
    }

    setStates(states: State[]): void {
        this.states = states;
    }

}
