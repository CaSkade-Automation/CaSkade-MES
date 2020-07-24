
const opcUaSkillExecutionMapping = [
    {
        objectToGroup: 'skill',
        name: 'skillMethod',
        toCollect: ['methodNodeId', 'skillNodeId', 'endpointUrl', 'userName', 'password'],
        childRoot: 'parameters'
    },
    {
        objectToGroup: 'parameter',
        name: 'parameter',
        toCollect: ['paramName', 'paramType', 'paramRequired', 'paramNodeId'],
        childRoot: 'parameters'
    },
];

export {
    opcUaSkillExecutionMapping,
};
