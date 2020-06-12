import { Capability } from "../capability/Capability";
import { RdfElement } from "../RdfElement";
import { Skill } from "../skill/Skill";

export class ProductionModule extends RdfElement{
    iri: string;
    label: string;
    interfaces? = Array<ModuleInterface>();
    components? = new Array<Component>();
    capabilities? = new Array<Capability>();

    constructor(iri: string, capabilities?: Capability[]) {
        super(iri);
        this.capabilities = capabilities;
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

export interface ModuleInterface {
    iri: string;
    connectedIris: Array<string>;
}

export interface Component {
    iri: string;
    components: Array<Component>;
}
