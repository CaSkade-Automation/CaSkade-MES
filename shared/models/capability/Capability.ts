import { RdfElement } from "../RdfElement";
import { FpbElement } from "../fpb/FpbElement";

export class Capability extends RdfElement {
    constructor(
        iri: string,
        public inputs: Array<FpbElement>,
        public outputs: Array<FpbElement>
    ) {
        super(iri);
    }
}
