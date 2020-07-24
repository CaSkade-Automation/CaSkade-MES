import { SkillParameter } from "./SkillParameter";

export class SkillExecutionRequest {

}

export class SkillExecutionRequestDto {
    skillIri: string;
    commandTypeIri: string;
    parameters: SkillParameter[];
}
