import { PropertyDTO } from "@shared/models/properties/PropertyDTO";
import { Property } from "./Property";

/**
 * This class describes a capability which is modelled in a capability task to be executed later with a skill
 */
export class BpmnTaskCapability{
    public capabilityIri
    public commandTypeIri: string;
    public selfResetting=false;
    public properties = new Array<Property>();

    constructor(dto: BpmnTaskCapabilityDTO) {
        this.capabilityIri = dto.capabilityIri;
        this.commandTypeIri = dto.commandTypeIri;
        this.selfResetting = dto.selfResetting;
        this.properties = dto.propertyDtos.map(propDto => new Property(propDto));
    }
}


export class BpmnTaskCapabilityDTO{
    constructor(
        public capabilityIri: string,
        public commandTypeIri: string,
        public selfResetting: boolean=false,
        public propertyDtos: PropertyDTO[] = []) {
    }
}

