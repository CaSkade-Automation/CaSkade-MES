import { MappingDefinition } from "sparql-result-converter";

const opcUaMethodSkillMapping: MappingDefinition[] = [
    {
        rootName: 'skillExecutionInfos',
        propertyToGroup: 'skillIri',
        name: 'skillIri',
        toCollect: ['skillMethodIri','methodNodeId', 'skillNodeId', 'endpointUrl', 'userName', 'password', 'messageSecurityMode', 'securityPolicy'],
        childMappings: [
            {
                rootName: 'parameters',
                propertyToGroup: 'parameterIri',
                name: 'parameterIri',
                toCollect: ['parameterIri','parameterName', 'parameterType', 'parameterRequired', 'parameterNodeId', 'parameterUaType'],
            },
        ]
    },
];


const opcUaVariableSkillMapping: MappingDefinition[] = [
    {
        rootName: 'skillExecutionInfos',
        propertyToGroup: 'skillIri',
        name: 'skillIri',
        toCollect: ['skillMethodIri','methodNodeId', 'skillNodeId', 'endpointUrl', 'userName', 'password', 'messageSecurityMode', 'securityPolicy', 'commandNodeId', 'commandNamespace', 'requiredCommandValue'],
        childMappings: [
            {
                rootName: 'parameters',
                propertyToGroup: 'parameterIri',
                name: 'parameterIri',
                toCollect: ['parameterIri','parameterName', 'parameterType', 'parameterRequired', 'parameterNodeId'],
            },
        ]
    },

];

const opcUaSkillParameterMapping: MappingDefinition[] = [
    {
        rootName: 'skillParameters',
        propertyToGroup: 'skillIri',
        name: 'skillIri',
        toCollect: ['endpointUrl', 'userName', 'password', 'messageSecurityMode', 'securityPolicy'],
        childMappings: [
            {
                rootName: 'parameters',
                propertyToGroup: 'parameterIri',
                name: 'parameterIri',
                toCollect: ['parameterIri','parameterName', 'parameterType', 'parameterRequired', 'parameterNodeId'],
            },
        ]
    },

];

const restSkillMapping: MappingDefinition[] = [
    {
        rootName: 'restSkillExecutionInfs',
        propertyToGroup: 'basePath',
        name: 'basePath',
        toCollect: ['basePath','path', 'httpMethod'],
        childMappings: [
            {
                rootName: 'parameters',
                propertyToGroup: 'parameterIri',
                name: 'parameterIri',
                toCollect: ['parameterIri','parameterName', 'parameterType', 'parameterRequired'],
            },
        ]
    },
];

export {
    opcUaMethodSkillMapping,
    opcUaVariableSkillMapping,
    opcUaSkillParameterMapping,
    restSkillMapping
};
