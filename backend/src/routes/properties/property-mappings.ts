import { MappingDefinition } from "sparql-result-converter";

const propertyMapping: MappingDefinition[] = [
    {
        rootName: 'properties',
        propertyToGroup: 'propertyIri',
        name: 'propertyIri',
        toCollect: ['code', 'dataType', 'definition', 'unit', 'parentElement'],
        childMappings: [
            {
                rootName: 'instances',
                propertyToGroup: 'propertyInstanceIri',
                name: 'propertyIri',
                toCollect: ['expressionGoal', 'logicInterpretation', 'value'],
            },
        ],
    },
];


export {
    propertyMapping,
};
