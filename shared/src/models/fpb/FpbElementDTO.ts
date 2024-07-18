import { PropertyDto } from "../properties/PropertyDto";

export class FpbElementDTO {
    iri: string;
    type: string;
    propertyDtos: Array<PropertyDto>
}

