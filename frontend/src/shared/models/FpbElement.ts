import { FpbElementDTO } from "@shared/models/fpb/FpbElementDto";
import { RdfElement } from "@shared/models/RdfElement";
import { Property } from "./Property";

export class FpbElement extends RdfElement {
    type: RdfElement;
    properties = new Array<Property>();

    constructor(elementDto: FpbElementDTO) {
        super(elementDto.iri);
        this.type = new RdfElement(elementDto.type);
        this.properties = elementDto.propertyDtos?.map(propDto => new Property(propDto))  || [];
    }
}
