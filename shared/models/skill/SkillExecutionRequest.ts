import { SkillVariable } from "./SkillVariable";

export class SkillExecutionRequest {

}

export class SkillExecutionRequestDto {
    skillIri: string;
    commandTypeIri: string;
    parameters: SkillVariable[];
}
