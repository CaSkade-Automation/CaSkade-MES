// A query fragment to get skill types
export const skillTypeFragment = `
?skill a ?skillType.
?skillType rdfs:subClassOf CSS:Skill.
FILTER(!isBlank(?skillType ))  # Filter out all blank nodes
FILTER NOT EXISTS {
    ?someSubSkillSubClass sesame:directSubClassOf ?skillType.  # Filter out upper classes, get only specific subtype
}`;

// A query fragment to ger all (input) parameters
export const parameterQueryFragment = `OPTIONAL {
    ?skill CSS:hasParameter ?parameterIri.
    ?parameterIri CaSk:hasVariableName ?parameterName;
        CaSk:hasVariableType ?parameterType;
        CaSk:isRequired ?parameterRequired.
    OPTIONAL {
        ?parameterIri CaSk:hasDefaultValue ?parameterDefault.
    }
    OPTIONAL {
        ?parameterIri CaSk:hasSkillVariableOption/CaSk:hasOptionValue ?paramOptionValue

    }
}`;

// A query fragment to ger all (output) parameters
export const outputQueryFragment = `OPTIONAL {
    ?skill CaSk:hasSkillOutput ?outputIri.
    ?outputIri CaSk:hasVariableName ?outputName;
        CaSk:hasVariableType ?outputType;
        CaSk:isRequired ?outputRequired.
    OPTIONAL {
        ?outputIri CaSk:hasDefaultValue ?outputDefault.
    }
    OPTIONAL {
        ?outputIri CaSk:hasSkillVariableOption/CaSk:hasOptionValue ?outputOptionValue
    }
}`;

