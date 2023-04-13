import { RdfElement } from "../RdfElement";
import { Command } from "./Command";
import { State } from "./State";

export abstract class StateMachine extends RdfElement{
    protected currentState: State;

    constructor(iri: string, currentState?: State) {
        super(iri);
        this.currentState = currentState;
    }

    abstract getCommands(): Command[];
    abstract getActiveCommands(): Command[];
    abstract getStates(): State[];

    setCurrentState(stateTypeIri: string) {
        const newState = this.getStates().find(state => state.iri == stateTypeIri);
        if (newState === undefined) throw new StateNotFoundError(`There is no state of type '${stateTypeIri}' on this state machine. Current state could not be changed`);

        // If the error is not thrown (i.e. newState is defined), set the new current state
        this.currentState = newState;
    }

    getCurrentState(): State {
        return this.currentState;
    }
}

class StateNotFoundError extends Error {
    constructor(message?) {
        super(message);
        this.name = this.constructor.name;
    }
}
