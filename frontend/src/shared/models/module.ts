export interface Module {
    name: string;
    capabilities: Capability[];
}

export interface Capability {
    name: string;
    hasInput: FpbState[];
    hasOutput: FpbState[];
    executableViaSkill: Skill[];
}


// Interface for Energy, Information and Product
// VDI3682 calls them "State"
export interface FpbState {
    name: string;
    stateType: string;    // Defines whether it's a product, energy, resource
}

export interface Skill {
    name: string;
}

export interface RestSkill {

}

export interface OpcUaSkill {

}
