import { MappingDefinition } from "sparql-result-converter";

const skillMapping: MappingDefinition[] = [
    {
        rootName: 'skills',
        propertyToGroup: 'skill',
        name: 'skillIri',
        toCollect: ['stateMachine', 'currentStateTypeIri'],
        childMappings: [
            {
                rootName: 'skillParameterDtos',
                propertyToGroup: 'parameterIri',
                name: 'parameterIri',
                toCollect: ['parameterIri', 'parameterName', 'parameterType', 'parameterRequired', 'parameterDefault'],
                childMappings: [
                    {
                        rootName: 'parameterOptionValues',
                        propertyToGroup: 'parameterOptionValue',
                        name: 'parameterOptionValue',
                    }
                ]
            },
            {
                rootName: 'skillOutputDtos',
                propertyToGroup: 'outputIri',
                name: 'outputIri',
                toCollect: ['outputIri', 'outputName', 'outputType', 'outputRequired', 'outputDefault'],
                childMappings: [
                    {
                        rootName: 'outputOptionValues',
                        propertyToGroup: 'outputOptionValue',
                        name: 'outputOptionValues',
                    }
                ]
            },
        ]
    },


];

export {
    skillMapping,
};
