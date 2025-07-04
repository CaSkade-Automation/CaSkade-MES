import { RdfElement } from "@shared/models/RdfElement";
import { FormulaConstraintDto, ValueConstraintDto } from "@shared/models/constraints/ConstraintDto";

export class ValueConstraint {
    readonly type = "ValueConstraint";

    dataElement: RdfElement;
    instanceDescription: RdfElement;
    expressionGoal: string;
    logicInterpretation: string;
    value: string | number;

    constructor(dto: ValueConstraintDto) {
        this.dataElement = new RdfElement(dto.dataElement);
        this.instanceDescription = new RdfElement(dto.instanceDescription);
        this.expressionGoal = dto.expressionGoal;
        this.logicInterpretation = dto.logicInterpretation;
        this.value = dto.value;
    }

    toString(): string {
        const iDName = this.instanceDescription.getLocalName();
        const constraintString = `${iDName} ${this.logicInterpretation} ${this.value}`;
        return constraintString;
    }

}


export class FormulaConstraint {
    readonly type = "FormulaConstraint";

    public capabilityIri: RdfElement
    public constraint: string

    constructor(dto: FormulaConstraintDto) {
        this.capabilityIri = new RdfElement(dto.capabilityIri);
        this.constraint = dto.constraint;
    }

    toString(): string {
        return this.constraint;
    }

}
