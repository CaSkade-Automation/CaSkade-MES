import { MappingDefinition } from "sparql-result-converter";

const capabilityMapping: MappingDefinition[] = [
    {
        rootName: 'capabilities',
        propertyToGroup: 'capability',
        name: 'iri',
        toCollect: ["skillIri", "capabilityType", "processType"],
        childMappings: [
            {
                rootName: 'inputs',
                propertyToGroup: 'input',
                name: 'iri',
                toCollect:['input', 'inputType as type']
            },
            {
                rootName: 'outputs',
                propertyToGroup: 'output',
                name: 'iri',
                toCollect:['output', 'outputType as type']
            }
        ]
    },
];


export {
    capabilityMapping,
};
