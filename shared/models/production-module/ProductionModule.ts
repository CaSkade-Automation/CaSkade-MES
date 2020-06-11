import { Capability } from "../capability/Capability";
import { RdfElement } from "../RdfElement";

export class ProductionModule extends RdfElement{
    iri: string;
    label: string;
    interfaces? = Array<ModuleInterface>();
    components? = new Array<Component>();
    capabilities? = new Array<Capability>();

    constructor(iri: string) {
        super(iri);
    }

    addCapability(newCapability: Capability): void {
        this.capabilities.push(newCapability);
    }

    addCapabilities(newCapabilities: Array<Capability>): void {
        console.log("Adding capabilities, new cap: ");
        console.log(newCapabilities);

        this.capabilities.push(...newCapabilities);
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
