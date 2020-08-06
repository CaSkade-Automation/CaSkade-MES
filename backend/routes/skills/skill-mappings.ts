
const skillMapping = [
    {
        objectToGroup: 'skill',
        name: 'skillIri',
        toCollect: ['stateMachine', 'currentStateTypeIri'],
        childRoot: 'skillParameterDtos'
    },
    {
        objectToGroup: 'parameterIri',
        name: 'parameterIri',
        toCollect: ['parameterIri', 'parameterName', 'parameterType', 'parameterRequired', 'parameterDefault'],
        childRoot: 'parameterOptionValues'
    },
    {
        objectToGroup: 'parameterOptionValue',
        name: 'parameterOptionValue',
        toCollect: ['parameterOptionValue'],
        childRoot: 'options'
    }
];

export {
    skillMapping,
};
