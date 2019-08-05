// Select all modules together with their processes and executable services

let querystring = `
PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
select ?module WHERE { 
	?module a VDI3682:TechnicalResource.
    OPTIONAL { 
        ?module VDI3682:TechnicalResourceIsAssignedToProcessOperator ?process.
    }
}
limit 100
`;

module.exports = querystring;
