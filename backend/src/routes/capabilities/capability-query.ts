export function getCapabilityQueryString(iriOrResourceFilter="", typeFilter = ""): string {
    const queryString = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
            PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
            PREFIX VDI3682: <http://www.w3id.org/hsu-aut/VDI3682#>
            PREFIX VDI2860: <http://www.hsu-ifa.de/ontologies/VDI2860#>
            PREFIX DIN8580: <http://www.hsu-ifa.de/ontologies/DIN8580#>
            SELECT ?capability ?input ?inputType ?outputType ?output ?capabilityType ?processType WHERE {
                ?capability a CSS:Capability.
                ${iriOrResourceFilter}
                OPTIONAL{
                    ?capability VDI3682:hasInput ?input.
                    ?input a ?inputType.
                    VALUES ?inputType {
                        VDI3682:Energy VDI3682:Product VDI3682:Information
                    }
                }
                OPTIONAL{
                    ?capability VDI3682:hasOutput ?output.
                    ?output a ?outputType.
                    VALUES ?outputType {
                        VDI3682:Energy VDI3682:Product VDI3682:Information
                    }
                }
                OPTIONAL{
                    ?capability a ?processType.
                    ?processType rdfs:subClassOf ?processParentType.
                    VALUES ?processParentType {
                        DIN8580:Fertigungsverfahren VDI2860:Handhaben
                    }
                    FILTER (
                        NOT EXISTS{ ?someSubtype rdfs:subClassOf ?processType.}
                    )
                }
                BIND(
                    IF(EXISTS { ?capability rdf:type CaSk:RequiredCapability },
                        CaSk:RequiredCapability,
                        IF(EXISTS { ?capability rdf:type CaSk:ProvidedCapability },
                            CaSk:ProvidedCapability,
                        CSS:Capability
                    )
                ) AS ?capabilityType)
                ${typeFilter}
            }`;
    return queryString;
}
