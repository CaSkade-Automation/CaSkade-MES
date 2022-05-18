import { MappingDefinition } from "sparql-result-converter";

const propertyMapping: MappingDefinition[] = [
    {
        rootName: 'properties',
        propertyToGroup: 'propertyInstanceIri',
        name: 'propertyInstanceIri',
        toCollect: ["describedElementIri", "propertyInstanceIri", "expressionGoal", "logicInterpretation", "value",
            "propertyTypeIri", "code", "definition", "unit"],
    },


];

export {
    propertyMapping,
};
