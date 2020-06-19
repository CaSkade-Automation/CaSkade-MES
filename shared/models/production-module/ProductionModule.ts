import { Capability, CapabilityDto } from "../capability/Capability";
import { RdfElement } from "../RdfElement";
import { Skill } from "../skill/Skill";

export class ProductionModule extends RdfElement{
    iri: string;
    interfaces? = Array<ModuleInterface>();
    components? = new Array<Component>();
    capabilities? = new Array<Capability>();

    constructor(moduleDto: ProductionModuleDto) {
        super(moduleDto.iri);
        this.capabilities = moduleDto.capabilityDtos.map(capabilityDto => new Capability(capabilityDto));
        this.interfaces = moduleDto.interfaces;
        this.components = moduleDto.components;
    }

    addCapability(newCapability: Capability): void {
        this.capabilities.push(newCapability);
    }

    addCapabilities(newCapabilities: Array<Capability>): void {
        this.capabilities.push(...newCapabilities);
    }

    /**
     * Utility getter that allows to easily get all skills of this module by looking at all capabilities' skills
     */
    get skills(): Array<Skill> {
        const skills = new Array<Skill>();
        this.capabilities.forEach(capability => {
            skills.push(...capability.skills);
        });
        return skills;
    }
}

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
