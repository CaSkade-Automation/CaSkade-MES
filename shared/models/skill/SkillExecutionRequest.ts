import { SkillVariable, SkillVariableDto } from "./SkillVariable";

export class SkillExecutionRequest {

}

export class SkillExecutionRequestDto {
    public parameters: SkillVariable[]

    constructor(public skillIri: string, public commandTypeIri: string, parameterDtos: SkillVariableDto[] = []) {
        this.parameters = parameterDtos.map(paramDto => new SkillVariable(paramDto));
    }
}
