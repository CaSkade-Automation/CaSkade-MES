export class ValueConstraintDto {
    readonly type = "ValueConstraint";

    constructor(
        public capabilityIri: string,
        public dataElement: string,
        public instanceDescription: string,
        public expressionGoal : string,
        public logicInterpretation: string,
        public value: string | number,
    ) {}
}



export class FormulaConstraintDto {
    readonly type = "FormulaConstraint";

    constructor(
        public capabilityIri: string,
        public constraint: string
    ) {}
}

