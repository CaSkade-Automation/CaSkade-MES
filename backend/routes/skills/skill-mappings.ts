
const skillMapping = [
    {
        objectToGroup: 'skill',
        name: 'skillIri',
        toCollect: ['stateMachine', 'currentStateTypeIri', 'skillParameters', 'skillResults'],
        childRoot: 'parameters'
    },
    {
        objectToGroup: 'parameter',
        name: 'parameterIri',
        toCollect: ['parameterName', 'parameterType', 'required', 'default'],
        childRoot: 'options'
    },
    {
        objectToGroup: 'paramOptionValue',
        name: 'optionValue',
        toCollect: [],
        childRoot: 'options'
    }
];

export {
    skillMapping,
};
