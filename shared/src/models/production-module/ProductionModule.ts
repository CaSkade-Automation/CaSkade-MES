import { SkillDto } from "../skill/Skill";


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
