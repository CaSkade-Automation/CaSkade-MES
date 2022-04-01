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
    describedElement: RdfElement;
    value?: string;

    constructor(dto: PropertyDTO) {
        super(dto.propertyInstanceIri);
        this.type = new PropertyType(dto.propertyTypeIri, dto.code, dto.definition, dto.unit);
        this.describedElement = new RdfElement(dto.describedElementIri);
        this.logicInterpretation = dto.logicInterpretation;
        this.expressionGoal = dto.expressionGoal;
        this.value = dto.value;
    }

    toDto(): PropertyDTO {
        const dto: PropertyDTO = {
            propertyInstanceIri: this.iri,
            code: this.type.code,
            definition: this.type.definition,
            unit: this.type.unit,
            propertyTypeIri: this.type.iri,
            expressionGoal: this.expressionGoal,
            describedElementIri: this.describedElement.iri,
            logicInterpretation: this.logicInterpretation,
            value: this.value
        };
        return dto;
    }
}


