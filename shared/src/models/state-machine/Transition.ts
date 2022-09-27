import { RdfElement } from "../RdfElement";
import { State } from "./State";

export class Transition extends RdfElement {
    constructor(iri: string) {
        super(iri);
    }

    /**
     * Further shortens the name by stripping off "command" etc.
     */
    getShortName() {
        const localName = this.getLocalName();
        return localName.split("_")[0];
    }
}
