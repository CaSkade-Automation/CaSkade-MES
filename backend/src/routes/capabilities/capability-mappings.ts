import { MappingDefinition } from "sparql-result-converter";

const capabilityMapping: MappingDefinition[] = [
    {
        rootName: 'capabilities',
        propertyToGroup: 'capability',
        name: 'iri',
        childMappings: [
            {
                rootName: 'inputs',
                propertyToGroup: 'input',
                name: 'inputs',
            },
            {
                rootName: 'outputs',
                propertyToGroup: 'output',
                name: 'outputs',
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
