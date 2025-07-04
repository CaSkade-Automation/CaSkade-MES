export enum PlanningResultType {
    SAT = "PlanningResultType.SAT",
    UNSAT = "PlanningResultType.UNSAT"
}

export class PlanningResultDto {
    timeCreated: string;
    resultType: PlanningResultType;
    plan: PlanDto | null
    unsatCore: Array<string> | null
}

export class PlanDto {
    plan_length: number
    plan_steps: PlanStep[]
}

class PlanStep {
    duration: number;
    step_number: number;
    capability_applications: CapabilityApplication[];
}

class CapabilityApplication {
    capability_iri: string;
    inputs: PropertyApplication[]
    outputs: PropertyApplication[]
}

class PropertyApplication {
    property_iri: string
    value: string
}
