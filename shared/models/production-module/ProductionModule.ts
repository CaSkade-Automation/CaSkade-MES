import { Capability, CapabilityDto } from "../capability/Capability";
import { RdfElement } from "../RdfElement";
import { Skill, SkillDto } from "../skill/Skill";

export class ProductionModule extends RdfElement{
    iri: string;
    interfaces? = Array<ModuleInterface>();
    components? = new Array<Component>();
    skills? = new Array<Skill>();

    constructor(moduleDto: ProductionModuleDto) {
        super(moduleDto.iri);
        this.skills = moduleDto.skillDtos.map(skillDto => new Skill(skillDto));
        this.interfaces = moduleDto.interfaces;
        this.components = moduleDto.components;
    }

    addSkill(newSkill: Skill): void {
        this.skills.push(newSkill);
    }

    addSkills(newSkills: Array<Skill>): void {
        this.skills.push(...newSkills);
    }

    /**
     * Utility getter that allows to easily get all capabilities that can be executed with skills of this module
     */
    get capabilities(): Array<Capability> {
        const capabilities = new Array<Capability>();
        this.skills.forEach(skill => {
            capabilities.push(...skill.relatedCapabilities);
        });
        return capabilities;
    }
}

export class ProductionModuleDto {
    iri: string;
    interfaces? : Array<ModuleInterface>;
    components? : Array<Component>;
    skillDtos?: Array<SkillDto>;
}

export interface ModuleInterface {
    iri: string;
    connectedIris: Array<string>;
}

export interface Component {
    iri: string;
    components: Array<Component>;
}
