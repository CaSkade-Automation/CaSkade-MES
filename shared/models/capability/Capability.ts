import { RdfElement } from "../RdfElement";
import { FpbElement } from "../fpb/FpbElement";

export class Capability extends RdfElement {
    constructor(
        iri: string,
        private inputs: Array<FpbElement>,
        private outputs: Array<FpbElement>
    ) {
        super(iri);
    }
}
