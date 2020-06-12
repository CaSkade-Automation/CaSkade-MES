import { RdfElement } from "../RdfElement";
import { State } from "./State";

export class Transition extends RdfElement {
    constructor(iri: string) {
        super(iri);
    }
}
