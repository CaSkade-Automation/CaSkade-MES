import { RdfElement } from "../RdfElement";
import { State } from "./State";
import { Transition } from "./Transition";

export abstract class StateMachine extends RdfElement{
    protected currentState: State;

    constructor(iri: string, currentState?: State) {
        super(iri);
        this.currentState = currentState;
    }

    abstract getCommands(): Transition[];
    abstract getActiveCommands(): Transition[];
    abstract getStates(): State[];

    setCurrentState(currentState: State) {
        this.currentState = currentState;
    }

    getCurrentState(): State {
        return this.currentState;
    };
}
