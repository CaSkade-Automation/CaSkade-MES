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

