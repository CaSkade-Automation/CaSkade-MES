/**
 * Returns the base query snippet that is used in every query of the RestSkillExecutor
 * @param skillIri IRI of the skill to execute
 * @returns Base snippet of the RestSkill execution query
 */
export function getRestSkillMethodQuery(skillIri: string): string {
    const query = `PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
    PREFIX WADL: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
    PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?basePath ?path  ?httpMethod ?parameterIri ?parameterName ?parameterType ?parameterRequired WHERE {
        <${skillIri}> a Cap:RestSkill;
            WADL:hasBase ?basePath;
            WADL:hasResource ?resource.
        ?resource WADL:hasPath ?path;
            WADL:hasMethod ?skillMethod.
        ?skillMethod a ?wadlMethod.
        BIND(strafter(str(?wadlMethod), "#") AS ?httpMethod).
        ?wadlMethod sesame:directSubClassOf WADL:Method.

        OPTIONAL {
            ?skill Cap:hasSkillParameter ?parameterIri.
            ?skillMethod WADL:hasRequest/WADL:hasRepresentation/WADL:hasParameter ?parameterIri.    # Make sure the skill's parameters are availabe over the method
            ?parameterIri a Cap:SkillParameter;
                Cap:hasVariableName ?parameterName;
                Cap:hasVariableType ?parameterType;
                Cap:isRequired ?parameterRequired;
        }`;
    return query;
}

/**
 * Returns a little query snippet for stateful methods to invoke a transition of the state machine.
 * In this case, the commandTypeIri is a type of command of the ISA 88 state machine which is connected with a skill method.
 * @param commandTypeIri
 * @returns
 */
export function getRestStatefulMethodQuerySnippet(commandTypeIri: string): string {
    const query = `
        <${commandTypeIri}> rdfs:subClassOf ISA88:Transition.
        ?command a <${commandTypeIri}>;
            Cap:invokedBy ?skillMethod.
    `;
    return query;
}

/**
 * Returns a little query snippet for stateless methods like "GetOutputs". In this case, there is no interaction with the stateMachine.
 * The skillMethod is directly given by the commandTypeIri
 * @param commandTypeIri IRI of a stateless method type such as GetOutputs
 * @returns
 */
export function getRestStatelessMethodQuerySnippet(commandTypeIri: string): string {
    const query = `
        <${commandTypeIri}> rdfs:subClassOf Cap:StatelessMethod.
        ?skillMethod a <${commandTypeIri}>;
    `;
    return query;
}


