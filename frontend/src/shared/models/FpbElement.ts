import { FpbElementDTO } from "@shared/models/fpb/FpbElementDTO";
import { RdfElement } from "@shared/models/RdfElement";
import { Property } from "./Property";

export class FpbElement extends RdfElement {
    type: string;
    properties = new Array<Property>();

    constructor(elementDto: FpbElementDTO) {
        super(elementDto.iri);
        this.type = elementDto.type;
        this.properties = elementDto.propertyDtos?.map(propDto => new Property(propDto));
    }
}
