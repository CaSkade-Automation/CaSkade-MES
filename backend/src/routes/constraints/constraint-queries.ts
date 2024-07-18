/**
 * Little helper function that returns the query to get simple value constraints, optionally filtered for just one capability
 * @param capabilityIri IRI of a capability in case only constraints of one particular capability are needed
 * @returns The value constraint query, optionally for only one capability
 */
export function getValueConstraintQuery(capabilityIri = '?cap'): string {
    const query = `
    PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
    PREFIX VDI3682: <http://www.w3id.org/hsu-aut/VDI3682#>

    SELECT ?dataElement ?instanceDescription ?expressionGoal ?logicInterpretation ?value
    WHERE {
        <${capabilityIri}> ?inOut ?fpdState.
        ?fpdState DINEN61360:has_Data_Element ?dataElement.
        ?dataElement a DINEN61360:Data_Element;
            DINEN61360:has_Instance_Description ?instanceDescription.
        ?instanceDescription a DINEN61360:Instance_Description;
            DINEN61360:Expression_Goal ?expressionGoal;
            DINEN61360:Logic_Interpretation ?logicInterpretation.
        ?instanceDescription DINEN61360:Value ?value.
    }`;
    return query;
}
