
const opcUaSkillExecutionMapping = [
    {
        objectToGroup: 'skillIri',
        name: 'skillIri',
        toCollect: ['skillMethodIri','methodNodeId', 'skillNodeId', 'endpointUrl', 'userName', 'password', 'messageSecurityMode', 'securityPolicy'],
        childRoot: 'parameters'
    },
    {
        objectToGroup: 'parameterIri',
        name: 'parameterIri',
        toCollect: ['parameterIri','parameterName', 'parameterType', 'parameterRequired', 'parameterNodeId', 'parameterUaType'],
        childRoot: 'parameters'
    },
];

const opcUaSkillParameterMapping = [
    {
        objectToGroup: 'skillIri',
        name: 'skillIri',
        toCollect: ['endpointUrl', 'userName', 'password', 'messageSecurityMode', 'securityPolicy'],
        childRoot: 'parameters'
    },
    {
        objectToGroup: 'parameterIri',
        name: 'parameterIri',
        toCollect: ['parameterIri','parameterName', 'parameterType', 'parameterRequired', 'parameterNodeId'],
        childRoot: 'parameters'
    },
];

export {
    opcUaSkillExecutionMapping,
    opcUaSkillParameterMapping
};
