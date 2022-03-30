import { MappingDefinition } from "sparql-result-converter";

const capabilityMapping: MappingDefinition[] = [
    {
        rootName: 'capabilities',
        propertyToGroup: 'capability',
        name: 'iri',
        toCollect: ["skillIri"],
        childMappings: [
            {
                rootName: 'inputs',
                propertyToGroup: 'input',
                name: 'iri',
                toCollect:['input']
            },
            {
                rootName: 'outputs',
                propertyToGroup: 'output',
                name: 'iri',
                toCollect:['output']
            }
        ]
    },


];

export {
    capabilityMapping,
};
