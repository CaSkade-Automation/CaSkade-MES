export function getRestSkillMethodQuery(skillIri: string) {
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

export function getRestStatefulMethodQuerySnippet(commandTypeIri: string): string {
    const query = `
        <${commandTypeIri}> rdfs:subClassOf ISA88:Transition.
        ?command a <${commandTypeIri}>;
            Cap:invokedBy ?skillMethod.
    `;
    return query;
}

export function getRestStatelessMethodQuerySnippet(commandTypeIri: string): string {
    const query = `
        <${commandTypeIri}> rdfs:subClassOf Cap:StatelessMethod.
        ?command a <${commandTypeIri}>;
            Cap:invokedBy ?skillMethod.
    `;
    return query;
}


