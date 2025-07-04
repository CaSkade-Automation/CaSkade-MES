import { MappingDefinition } from "sparql-result-converter";

export const constraintMapping: MappingDefinition[] = [
    {
        rootName: 'constraints',
        propertyToGroup: 'instanceDescription',
        name: 'instanceDescription',
        toCollect: ["dataElement", "expressionGoal", "logicInterpretation", "value"],
    },
];

// childMappings: [
//     {
//         rootName: 'inputs',
//         propertyToGroup: 'input',
//         name: 'iri',
//         toCollect:['input', 'inputType']
//     },
//     {
//         rootName: 'outputs',
//         propertyToGroup: 'output',
//         name: 'iri',
//         toCollect:['output', 'outputType']
//     }
// ]
