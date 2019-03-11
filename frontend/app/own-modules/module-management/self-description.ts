export interface SelfDescription {
    header: Header;
    body: Body;
}

export interface Header {
    id: string;
    name: string;
}

export interface Body {
    moduleFunctions: ModuleFunction[];
}

export interface ModuleFunction {
    name: string;
    description: string;
    location: string;
    requestMethod: string;
    parameters: Parameter[];
}

export interface Parameter {
    name: string;
    dataType: string;
}




