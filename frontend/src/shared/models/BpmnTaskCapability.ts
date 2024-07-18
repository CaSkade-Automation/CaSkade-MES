import { PropertyInstanceDto } from "@shared/models/properties/PropertyDto";
import { PropertyInstance } from "./Property";

/**
 * This class describes a capability which is modelled in a capability task to be executed later with a skill
 */
export class BpmnTaskCapability{
    public capabilityIri
    public commandTypeIri: string;
    public selfResetting=false;
    public propertyInstances = new Array<PropertyInstance>();

    constructor(dto: BpmnTaskCapabilityDTO) {
        this.capabilityIri = dto.capabilityIri;
        this.commandTypeIri = dto.commandTypeIri;
        this.selfResetting = dto.selfResetting;
        this.propertyInstances = dto.propertyInstanceDtos.map(propDto => new PropertyInstance(propDto));
    }
}


export class BpmnTaskCapabilityDTO{
    constructor(
        public capabilityIri: string,
        public commandTypeIri: string,
        public selfResetting: boolean=false,
        public propertyInstanceDtos: PropertyInstanceDto[] = []) {
    }
}

