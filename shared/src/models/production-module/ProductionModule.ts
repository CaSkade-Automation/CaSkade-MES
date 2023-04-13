import { CapabilityDto } from "../capability/Capability";


export class ProductionModuleDto {
    iri: string;
    interfaces? : Array<ModuleInterface>;
    components? : Array<Component>;
    capabilityDtos?: Array<CapabilityDto>;
}

export interface ModuleInterface {
    iri: string;
    connectedIris: Array<string>;
}

export interface Component {
    iri: string;
    components: Array<Component>;
}
