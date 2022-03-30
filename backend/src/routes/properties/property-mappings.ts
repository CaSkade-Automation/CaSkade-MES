import { MappingDefinition } from "sparql-result-converter";

const propertyMapping: MappingDefinition[] = [
    {
        rootName: 'properties',
        propertyToGroup: 'propertyInstance',
        name: 'property',
        toCollect: ["describedElementIri", "propertyInstance", "expressionGoal", "logicInterpretation", "value",
            "propertyTypeIri", "code", "definition", "unit"],
    },


];

export {
    propertyMapping,
};
