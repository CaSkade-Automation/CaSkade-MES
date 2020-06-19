import { RdfElement } from "../RdfElement";
import { Transition } from "./Transition";

export class State extends RdfElement {

    constructor(iri: string, private outgoingCommands: Transition[]) {
        super(iri);
    }

    getActiveCommands(): Transition[] {
        return this.outgoingCommands;
    }
}
