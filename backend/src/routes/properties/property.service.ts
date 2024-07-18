import { Injectable } from "@nestjs/common";
import { SparqlResultConverter } from "sparql-result-converter";
import { GraphDbConnectionService } from "../../util/GraphDbConnection.service";
import { PropertyDto } from "../../../../shared/src/models/properties/PropertyDto";
import { propertyMapping } from "./property-mappings";


const converter = new SparqlResultConverter();

export enum VDI3682RelationType {
    "VDI3682:hasInput",
    "VDI3682:hasOutput",
}

@Injectable()
export class PropertyService {

    constructor(
        private graphDbConnection: GraphDbConnectionService,
    ) { }

    async getAllProperties(): Promise<Array<PropertyDto>> {
        const queryString = `
        PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>

        SELECT ?parentElement ?propertyIri ?propertyInstanceIri ?expressionGoal ?logicInterpretation
            ?value ?typeDescription ?code ?dataType ?definition ?unit
        WHERE {
            ?parentElement DINEN61360:has_Data_Element ?propertyIri.
            ?propertyIri a DINEN61360:Data_Element;
				DINEN61360:has_Instance_Description ?propertyInstanceIri.
			?propertyInstanceIri a DINEN61360:Instance_Description;
                DINEN61360:Expression_Goal ?expressionGoal;
                DINEN61360:Logic_Interpretation ?logicInterpretation.
            ?dataElement DINEN61360:has_Type_Description ?typeDescription.

            OPTIONAL {
                ?propertyInstanceIri DINEN61360:Value ?value.
            }
            OPTIONAL {
                ?typeDescription DINEN61360:Code ?code;
                    DINEN61360:Definition ?definition.
            }
            OPTIONAL {
                ?typeDescription DINEN61360:Unit_of_Measure ?unit.
            }
			OPTIONAL {
                ?propertyInstanceIri a ?dataType.
				?dataType rdfs:subClassOf DINEN61360:Simple_Data_Type.
            }
        }`;
        const rawResult = await this.graphDbConnection.executeQuery(queryString);

        const result = converter.convertToDefinition(rawResult.results.bindings, propertyMapping)
            .getFirstRootElement() as Array<PropertyDto>;
        return result;
    }

    async getPropertyByIri(propertyIri: string): Promise<PropertyDto>{
        const queryString = `
        PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>

        SELECT ?propertyInstanceIri ?expressionGoal ?logicInterpretation ?typeDescription
            ?value ?typeDescription ?code ?definition ?unit
        WHERE {
            ?propertyInstanceIri a DINEN61360:Instance_Description;
                DINEN61360:Expression_Goal ?expressionGoal;
                DINEN61360:Logic_Interpretation ?logicInterpretation;
                ^DINEN61360:has_Instance_Description ?dataElement.
            OPTIONAL {
                ?propertyInstanceIri DINEN61360:Value ?value.
            }
            ?dataElement DINEN61360:has_Type_Description ?typeDescription.
            ?typeDescription DINEN61360:Code ?code;
                DINEN61360:Definition ?definition.
            OPTIONAL {
                ?typeDescription DINEN61360:Unit_of_Measure ?unit.
            }
            FILTER(?propertyInstanceIri = <${propertyIri}>)
        }`;
        const rawResult = await this.graphDbConnection.executeQuery(queryString);
        const result = converter.convertToDefinition(rawResult.results.bindings, propertyMapping).getFirstRootElement()[0] as PropertyDto;
        return result;
    }

    async getPropertiesOfCapability(capabilityIri: string, inOut?: VDI3682RelationType): Promise<Array<PropertyDto>> {
        let relationType = "VDI3682:hasInput VDI3682:hasOutput";
        if (inOut) {
            relationType = VDI3682RelationType[inOut];
        }

        const queryString = `
        PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
        PREFIX VDI3682: <http://www.w3id.org/hsu-aut/VDI3682#>

        SELECT ?parentElement ?propertyIri ?propertyInstanceIri ?expressionGoal ?logicInterpretation
            ?typeDescription ?value ?code ?dataType ?definition ?unit
        WHERE {
            <${capabilityIri}> ?inOut ?parentElement.
            VALUES ?inOut {${relationType}}
            ?parentElement DINEN61360:has_Data_Element ?propertyIri.
            # ?propertyIri a CSS:Property;
			?propertyIri DINEN61360:has_Instance_Description ?propertyInstanceIri.
			?propertyInstanceIri a DINEN61360:Instance_Description;
                DINEN61360:Logic_Interpretation ?logicInterpretation.
            ?dataElement DINEN61360:has_Type_Description ?typeDescription.

            OPTIONAL {?propertyInstanceIri DINEN61360:Expression_Goal ?expressionGoal.}
            OPTIONAL {
                ?propertyInstanceIri DINEN61360:Value ?value.
            }
            OPTIONAL {
                ?typeDescription DINEN61360:Code ?code;
                    DINEN61360:Definition ?definition.
            }
            OPTIONAL {
                ?typeDescription DINEN61360:Unit_of_Measure ?unit.
            }
			OPTIONAL {
                ?propertyInstanceIri a ?dataType.
				?dataType rdfs:subClassOf DINEN61360:Simple_Data_Type.
            }
        }`;
        const rawResult = await this.graphDbConnection.executeQuery(queryString);
        const result = converter.convertToDefinition(rawResult.results.bindings, propertyMapping)
            .getFirstRootElement() as Array<PropertyDto>;
        return result;
    }

}
