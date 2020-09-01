export const parameterQueryFragment = `OPTIONAL {
    ?skill Cap:hasSkillParameter ?parameterIri.
    ?parameterIri Cap:hasVariableName ?parameterName;
        Cap:hasVariableType ?parameterType;
        Cap:isRequired ?parameterRequired.
    OPTIONAL {
        ?parameterIri Cap:hasDefaultValue ?parameterDefault.
    }
    OPTIONAL {
        ?parameterIri Cap:hasSkillVariableOption/Cap:hasOptionValue ?paramOptionValue

    }
}`;

export const outputQueryFragment = `OPTIONAL {
    ?skill Cap:hasSkillOutput ?outputIri.
    ?outputIri Cap:hasVariableName ?outputName;
        Cap:hasVariableType ?outputType;
        Cap:isRequired ?outputRequired.
    OPTIONAL {
        ?outputIri Cap:hasDefaultValue ?outputDefault.
    }
    OPTIONAL {
        ?parameterIri Cap:hasSkillVariableOption/Cap:hasOptionValue ?outputOptionValue
    }
}`;

