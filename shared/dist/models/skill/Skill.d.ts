import { RdfElement } from '../RdfElement';
import { StateMachine } from '../state-machine/StateMachine';
import { State } from '../state-machine/State';
export declare class Skill extends RdfElement {
    private stateMachine;
    private currentState;
    constructor(iri: string, stateMachine: StateMachine, currentState: State);
}
//# sourceMappingURL=Skill.d.ts.map