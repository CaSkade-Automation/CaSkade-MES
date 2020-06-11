import { RdfElement } from "../RdfElement";

export class FpbElement extends RdfElement {
    constructor(iri: string) {
        super(iri);
    }
}

// TODO: There is currently no specialization for the three different FpbElements
export class Information extends FpbElement {
    constructor(iri: string) {
        super(iri);
    }
}

export class Energy extends FpbElement {
    constructor(iri: string) {
        super(iri);
    }
}

export class Product extends FpbElement {
    constructor(iri: string) {
        super(iri);
    }
}
