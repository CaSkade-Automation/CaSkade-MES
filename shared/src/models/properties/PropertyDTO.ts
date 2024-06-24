export class PropertyInstanceDto {
    propertyInstanceIri: string;
    logicInterpretation: string;    // according to IEC 61360 ODP: operators such as <, <=, =, ...
    expressionGoal: ExpressionGoal;
    value?: string;
}


export class PropertyDTO {
    propertyIri: string;        // IRI of the data element
    parentElement: string;
    dataType: string;
    code?: string;
    definition: string;
    unit?: string;
    instances: Array<PropertyInstanceDto>
}



/**
 * ExpressionGoals as modelled in Ontology Design Pattern of IEC 61360
 */
export enum ExpressionGoal {
    None = "",
    Requirement="Requirement",
    Assurance="Assurance",
    Actual_Value="Actual_Value"
}
