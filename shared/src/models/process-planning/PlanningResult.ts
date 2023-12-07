export class PlanningResultDto {
    time_created: string;
    plan: PlanDto
}

class PlanDto {
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
