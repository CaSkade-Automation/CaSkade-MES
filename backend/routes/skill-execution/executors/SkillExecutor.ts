import { SkillExecutionRequestDto } from "@shared/models/skill/SkillExecutionRequest";
import { SkillVariableDto } from "../../../../shared/models/skill/SkillVariable";

export interface SkillExecutor {
    executeSkill(executionRequest: SkillExecutionRequestDto): void;
    setSkillParameters(skillIri: string, parameters: SkillVariableDto[]): void;
}
