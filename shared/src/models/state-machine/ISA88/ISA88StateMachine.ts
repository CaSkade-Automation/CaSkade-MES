import { State } from "../State";
import { StateMachine } from "../StateMachine";
import { Transition } from "../Transition";

export class Isa88StateMachine extends StateMachine {

    states: State[];
    commands: Transition[];

    getCommands(): Transition[] {
        return this.commands;
    }

    getActiveCommands(): Transition[] {
        return this.currentState.getActiveCommands();
    }

    getStates(): State[] {
        return this.states;
    }

    setCommands(commands: Transition[]): void {
        this.commands = commands;
    }

    setStates(states: State[]): void {
        this.states = states;
    };

}
