import { RdfElement } from "../RdfElement";
import { Transition } from "./Transition";

export class State extends RdfElement {
    constructor(iri: string) {
        super(iri);
    }
}
