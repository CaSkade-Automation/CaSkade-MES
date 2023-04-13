import { RdfElement } from "../RdfElement";
import { Command } from "./Command";

export class State extends RdfElement {

    constructor(iri: string, private outgoingCommands: Command[]) {
        super(iri);
    }

    getActiveCommands(): Command[] {
        return this.outgoingCommands;
    }
}
