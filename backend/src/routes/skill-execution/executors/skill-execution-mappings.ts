import { MappingDefinition } from "sparql-result-converter";

export const opcUaServerInfoMapping: MappingDefinition[] = [
    {
        rootName: 'opcUaServerInfo',
        propertyToGroup: 'serverIri',
        name: 'serverIri',
        toCollect: ['serverIri'],
        childMappings: [
            {
                rootName: 'endpoints',
                propertyToGroup: 'endpoint',
                name: 'endpoint',
                toCollect: ['endpointUrl', 'messageSecurityMode', 'securityPolicy'],
                childMappings: [
                    {
                        rootName: 'userIdentityTokens',
                        propertyToGroup: 'userIdentityToken',
                        name: 'userIdentityToken',
                        toCollect: ['tokenType', 'userName', 'password'],
                    },
                ],
            },
        ],

    },
];

const opcUaMethodSkillMapping: MappingDefinition[] = [
    {
        rootName: 'skillExecutionInfos',
        propertyToGroup: 'skillIri',
        name: 'skillIri',
        toCollect: ['skillMethodIri', 'skillInterface', 'methodNodeId', 'skillNodeId'],
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
        toCollect: ['skillMethodIri', 'skillInterface', 'methodNodeId', 'skillNodeId', 'commandNodeId', 'commandNamespace', 'requiredCommandValue'],
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

const opcUaVariableSkillOutputMapping: MappingDefinition[] = [
    {
        rootName: 'skillExecutionInfos',
        propertyToGroup: 'skillIri',
        name: 'skillIri',
        toCollect: ['endpointUrl', 'username', 'password', 'messageSecurityMode', 'securityPolicy'],
        childMappings: [
            {
                rootName: 'outputs',
                propertyToGroup: 'outputIri',
                name: 'outputIri',
                toCollect: ['outputIri','outputNodeId', 'outputName'],
            },
        ]
    },
];

const opcUaSkillParameterMapping: MappingDefinition[] = [
    {
        rootName: 'skillParameters',
        propertyToGroup: 'skillIri',
        name: 'skillIri',
        toCollect: ['endpointUrl', 'username', 'password', 'messageSecurityMode', 'securityPolicy'],
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
    restSkillMapping,
    opcUaVariableSkillOutputMapping
};
