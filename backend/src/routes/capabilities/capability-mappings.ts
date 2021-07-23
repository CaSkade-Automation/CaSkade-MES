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
                childMappings: [
                    {
                        rootName: 'outputs',
                        propertyToGroup: 'output',
                        name: 'outputs',
                    }
                ]
            },
        ]
    },


];

export {
    capabilityMapping,
};
