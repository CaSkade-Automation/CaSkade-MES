import { MappingDefinition } from "sparql-result-converter";

const capabilityMapping: MappingDefinition[] = [
    {
        rootName: 'capabilities',
        propertyToGroup: 'capability',
        name: 'iri',
        toCollect: ["skillIri", "capabilityType"],
        childMappings: [
            {
                rootName: 'inputs',
                propertyToGroup: 'input',
                name: 'iri',
                toCollect:['input', 'inputType']
            },
            {
                rootName: 'outputs',
                propertyToGroup: 'output',
                name: 'iri',
                toCollect:['output', 'outputType']
            }
        ]
    },
];

// {
//     rootName: 'skillParameters',
//     propertyToGroup: 'parameterIri',
//     name: 'parameterIri',
//     toCollect: ['parameterIri', 'parameterName', 'parameterType', 'parameterRequired', 'parameterDefault'],
//     childMappings: [
//         {
//             rootName: 'parameterOptionValues',
//             propertyToGroup: 'paramOptionValue',
//             name: 'value',
//         }
//     ]
// },

export {
    capabilityMapping,
};
