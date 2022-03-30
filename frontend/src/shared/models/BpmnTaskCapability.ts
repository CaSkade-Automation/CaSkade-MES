import { Property } from "./Property";

/**
 * This class describes a capability which is modelled in a capability task to be executed later with a skill
 */
export class BpmnTaskCapability{
    constructor(
        public capabilityIri: string,
        public commandTypeIri: string,
        public selfResetting: boolean=false,
        public properties: Property[] = []) {
    }
}
