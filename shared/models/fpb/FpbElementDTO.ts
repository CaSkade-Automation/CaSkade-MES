import { PropertyDTO } from "../properties/PropertyDTO";

export class FpbElementDTO {
    iri: string;
    type: string;
    propertyDtos: Array<PropertyDTO>
}

