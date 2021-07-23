import {MappingDefinition} from "sparql-result-converter";

const moduleMapping:MappingDefinition[] = [
    {
        rootName: 'modules',
        propertyToGroup: 'module',
        name: 'iri',
        childMappings: [{
            rootName: 'components'
        }]
    },
];

export {
    moduleMapping,
};
