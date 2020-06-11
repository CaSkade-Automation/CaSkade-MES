import { RdfElement } from "../RdfElement";
import { Transition } from "./Transition";

export class State extends RdfElement {
    constructor(iri: string, private connectedWith: Array<Transition>) {
        super(iri);
    }
}
