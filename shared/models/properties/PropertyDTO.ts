export class PropertyDTO {
    propertyInstanceIri: string;
    describedElementIri: string;
    logicInterpretation: string;    // according to IEC 61360 ODP: operators such as <, <=, =, ...
    expressionGoal: ExpressionGoal;
    value?: string;
    propertyTypeIri: string;
    code: string;
    unit?: string;
    definition: string;
}


/**
 * ExpressionGoals as modelled in Ontology Design Pattern of IEC 61360
 */
export enum ExpressionGoal {
    Requirement="Requirement",
    Assurance="Assurance",
    Actual_Value="Actual_Value"
}
