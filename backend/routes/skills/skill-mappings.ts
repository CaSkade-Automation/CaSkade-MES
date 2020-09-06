import { MappingDefinition } from "sparql-result-converter";

const skillMapping: MappingDefinition[] = [
    {
        rootName: 'skills',
        propertyToGroup: 'skill',
        name: 'skillIri',
        toCollect: ['stateMachine', 'currentStateTypeIri'],
        childMappings: [
            {
                rootName: 'skillParameters',
                propertyToGroup: 'parameterIri',
                name: 'parameterIri',
                toCollect: ['parameterIri', 'parameterName', 'parameterType', 'parameterRequired', 'parameterDefault'],
                childMappings: [
                    {
                        rootName: 'parameterOptionValues',
                        propertyToGroup: 'paramOptionValue',
                        name: 'value',
                    }
                ]
            },
            {
                rootName: 'skillOutputs',
                propertyToGroup: 'outputIri',
                name: 'outputIri',
                toCollect: ['outputIri', 'outputName', 'outputType', 'outputRequired', 'outputDefault'],
                childMappings: [
                    {
                        rootName: 'outputOptionValues',
                        propertyToGroup: 'outputOptionValue',
                        name: 'value',
                    }
                ]
            },
        ]
    },


];

export {
    skillMapping,
};
