import { Component, ModuleInterface, ProductionModuleDto } from "@shared/models/production-module/ProductionModule";
import { RdfElement } from "@shared/models/RdfElement";
import { D3GraphData, D3ModuleNode, D3Serializable } from "../../modules/graph-visualization/D3GraphData";
import { Capability } from "./Capability";
import { Skill } from "./Skill";

export class ProductionModule extends RdfElement implements D3Serializable {
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

    toD3GraphData(): D3GraphData {
        const data = new D3GraphData();
        const moduleNode = new D3ModuleNode(this.iri,this.getLocalName());
        data.nodes.push(moduleNode);

        return data;
    }
}
