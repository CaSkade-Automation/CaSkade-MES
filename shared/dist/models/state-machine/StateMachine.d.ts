import { RdfElement } from "../RdfElement";
import { State } from "./State";
import { Transition } from "./Transition";
export declare class StateMachine extends RdfElement {
    private States;
    private transitions;
    constructor(iri: string, States: Array<State>, transitions: Array<Transition>);
}
//# sourceMappingURL=StateMachine.d.ts.map