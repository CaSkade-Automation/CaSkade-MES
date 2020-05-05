export class ProductionModule {
    iri: string;
    interfaces?: Array<ModuleInterface>;
    components?: Array<Component>;
}

export interface ModuleInterface {
    iri: string;
    connectedIris: Array<string>;
}

export interface Component {
    iri: string;
    components: Array<Component>;
}
