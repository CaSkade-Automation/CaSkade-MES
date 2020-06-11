import { RdfElement } from '../RdfElement';
import { StateMachine } from '../state-machine/StateMachine';
import { State } from '../state-machine/State';

export class Skill extends RdfElement{
    constructor(
        iri: string,
        public stateMachine: StateMachine,
        public currentState: State) {
        super(iri);
    }
}
