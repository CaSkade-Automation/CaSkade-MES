// Select all modules together with their processes and executable services

module.exports = function(moduleName) {
    return `PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
PREFIX WADL: <http://www.hsu-ifa.de/ontologies/WADL#>
PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
PREFIX OPS: <http://www.hsu-ifa.de/ontologies/OPS-KnowledgeBase#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
select ?module ?process ?method ?methodType ?resourcesBase ?resourcePath ?param ?paramType ?paramDataType ?paramName ?paramLocation ?paramOptionValue WHERE { 
	BIND(WADL:${moduleName} AS ?module)
    ?module VDI3682:TechnicalResourceIsAssignedToProcessOperator ?process.
	
    # Optional: Process has executable service
    OPTIONAL{
        ?process OPS:IsExecutableVia ?method.
        ?resources WADL:hasResource ?resource;
                   WADL:hasBase ?resourcesBase.
        ?resource WADL:hasMethod ?method;
                  WADL:hasPath ?resourcePath.
        ?method WADL:hasRequest ?request;
                a ?methodType.
        ?methodType sesame:directSubClassOf WADL:Method.
       # Query parameters
        OPTIONAL{
            ?request WADL:hasParameter ?param.
    		?param WADL:hasParameterType ?paramDataType;
               WADL:hasParameterName ?paramName;
               a ?paramType.
        	?paramType sesame:directSubClassOf WADL:Parameter.
			BIND(STR("other") AS ?paramLocation).
        	OPTIONAL {
                ?param WADL:hasParameterOption ?paramOption.
                ?paramOption WADL:hasOptionValue ?paramOptionValue.
            }
            }
        #Body parameters
         OPTIONAL{
            ?request WADL:hasRepresentation ?rep.
            ?rep WADL:hasParameter ?param.
    		?param WADL:hasParameterType ?paramDataType;
               WADL:hasParameterName ?paramName;
               a ?paramType.
        	?paramType sesame:directSubClassOf WADL:Parameter.
            BIND(STR("body") AS ?paramLocation).
        	OPTIONAL {
                ?param WADL:hasParameterOption ?paramOption.
                ?paramOption WADL:hasOptionValue ?paramOptionValue.
            }
        }
	}
}
limit 100
`;
}
