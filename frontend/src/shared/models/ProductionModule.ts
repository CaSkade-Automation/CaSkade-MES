import { Component, ModuleInterface, ProductionModuleDto } from "@shared/models/production-module/ProductionModule";
import { RdfElement } from "@shared/models/RdfElement";
import { D3GraphData, D3ModuleNode, D3Serializable } from "../../modules/graph-visualization/D3GraphData";
import { Capability } from "./Capability";
import { Skill } from "./Skill";

export class ProductionModule extends RdfElement implements D3Serializable {
    iri: string;
    interfaces? = Array<ModuleInterface>();
    components? = new Array<Component>();
    capabilities? = new Array<Capability>();

    constructor(moduleDto: ProductionModuleDto) {
        super(moduleDto.iri);
        this.capabilities = moduleDto.capabilityDtos.map(capDto => new Capability(capDto));
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
     * Utility getter that allows to easily get all capabilities that can be executed with skills of this module
     */
    get skills(): Array<Skill> {
        const skills = new Array<Skill>();
        this.capabilities.forEach(cap => {
            skills.push(...cap.skills);
        });
        return skills;
    }

    toD3GraphData(): D3GraphData {
        const data = new D3GraphData();
        const moduleNode = new D3ModuleNode(this.iri,this.getLocalName());
        data.nodes.push(moduleNode);

        return data;
    }
}
