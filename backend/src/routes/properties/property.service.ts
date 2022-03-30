import { Injectable } from "@nestjs/common";
import { SparqlResultConverter } from "sparql-result-converter";
import { GraphDbConnectionService } from "../../util/GraphDbConnection.service";
import { PropertyDTO } from "@shared/models/properties/PropertyDTO";
import { propertyMapping } from "./property-mappings";


const converter = new SparqlResultConverter();

@Injectable()
export class PropertyService {

    constructor(
        private graphDbConnection: GraphDbConnectionService,
    ) { }

    async getAllProperties(): Promise<Array<PropertyDTO>> {
        const queryString = `
        PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>

        SELECT ?propertyInstance ?expressionGoal ?logicInterpretation ?value ?propertyType ?code ?definition ?unit WHERE {
            ?propertyInstance a DINEN61360:Instance_Description;
                DINEN61360:Expression_Goal ?expressionGoal;
                DINEN61360:Logic_Interpretation ?logicInterpretation;
                ^DINEN61360:has_Instance_Description ?dataElement.
            OPTIONAL {
                ?propertyInstance DINEN61360:Value ?value.
            }
            ?dataElement DINEN61360:has_Type_Description ?propertyType.
            ?propertyType DINEN61360:Code ?code;
                DINEN61360:Definition ?definition.
            OPTIONAL {
                ?propertyType DINEN61360:Unit_of_Measure ?unit.
            }
        }`;
        const rawResult = await this.graphDbConnection.executeQuery(queryString);
        const result = converter.convertToDefinition(rawResult.results.bindings, propertyMapping).getFirstRootElement() as Array<PropertyDTO>;
        return result;
    }

    async getPropertyByIri(propertyIri: string): Promise<PropertyDTO>{
        const queryString = `
        PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>

        SELECT ?propertyInstance ?expressionGoal ?logicInterpretation ?value ?propertyType ?code ?definition ?unit WHERE {
            ?propertyInstance a DINEN61360:Instance_Description;
                DINEN61360:Expression_Goal ?expressionGoal;
                DINEN61360:Logic_Interpretation ?logicInterpretation;
                ^DINEN61360:has_Instance_Description ?dataElement.
            OPTIONAL {
                ?propertyInstance DINEN61360:Value ?value.
            }
            ?dataElement DINEN61360:has_Type_Description ?propertyType.
            ?propertyType DINEN61360:Code ?code;
                DINEN61360:Definition ?definition.
            OPTIONAL {
                ?propertyType DINEN61360:Unit_of_Measure ?unit.
            }
            FILTER(?propertyInstance = <${propertyIri}>)
        }`;
        const rawResult = await this.graphDbConnection.executeQuery(queryString);
        const result = converter.convertToDefinition(rawResult.results.bindings, propertyMapping).getFirstRootElement()[0] as PropertyDTO;
        return result;
    }

    async getInputPropertiesOfCapability(capabilityIri: string): Promise<Array<PropertyDTO>> {
        const queryString = `
        PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
        PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>

        SELECT ?describedElementIri ?propertyInstanceIri ?expressionGoal ?logicInterpretation ?value ?propertyTypeIri ?code ?definition ?unit WHERE {
            <${capabilityIri}> VDI3682:hasInput ?describedElementIri.
            ?describedElementIri DINEN61360:has_Data_Element ?dataElement.
            ?propertyInstanceIri a DINEN61360:Instance_Description;
                DINEN61360:Expression_Goal ?expressionGoal;
                DINEN61360:Logic_Interpretation ?logicInterpretation;
                ^DINEN61360:has_Instance_Description ?dataElement.
            OPTIONAL {
                ?propertyInstanceIri DINEN61360:Value ?value.
            }
            ?dataElement DINEN61360:has_Type_Description ?propertyTypeIri.
            ?propertyTypeIri DINEN61360:Code ?code;
                DINEN61360:Definition ?definition.
            OPTIONAL {
                ?propertyTypeIri DINEN61360:Unit_of_Measure ?unit.
            }
        }`;
        const rawResult = await this.graphDbConnection.executeQuery(queryString);
        const result = converter.convertToDefinition(rawResult.results.bindings, propertyMapping).getFirstRootElement() as Array<PropertyDTO>;
        return result;
    }

}
