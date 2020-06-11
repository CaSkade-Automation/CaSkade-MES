
const capabilityMapping = [
    {
        objectToGroup: 'capability',
        name: 'iri',
        childRoot: 'inputs'
    },
    {
        objectToGroup: 'input',
        name: 'inputs',
        childRoot: 'outputs'
    },
    {
        objectToGroup: 'output',
        name: 'outputs',
        childRoot: 'outputs'
    }
];

export {
    capabilityMapping,
};
