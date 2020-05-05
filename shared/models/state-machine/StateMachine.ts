import { RdfElement } from "../RdfElement";
import { State } from "./State";
import { Transition } from "./Transition";

export class StateMachine extends RdfElement{
    constructor(iri: string, private States: Array<State>, private transitions: Array<Transition>) {
        super(iri);
    }
}
