import { ExpressionGoal, PropertyDTO } from "@shared/models/properties/PropertyDTO";
import { RdfElement } from "@shared/models/RdfElement";

export class PropertyType extends RdfElement {
    constructor(
        iri: string,
        public code: string,
        public definition: string,
        public unit: string
    ) {
        super(iri);
    }
}

export class Property extends RdfElement {
    type: PropertyType;
    logicInterpretation: string;    // according to IEC 61360 ODP: operators such as <, <=, =, ...
    expressionGoal: ExpressionGoal;
    value?: string;

    constructor(dto: PropertyDTO) {
        super(dto.iri);
        this.type = new PropertyType(dto.propertyTypeIri, dto.code, dto.definition, dto.unit);
        this.logicInterpretation = dto.logicInterpretation;
        this.expressionGoal = dto.expressionGoal;
    }
}


