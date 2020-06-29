import { SkillExecutionRequestDto } from "@shared/models/skill/SkillExecutionRequest";

export interface SkillExecutor {
    executeSkill(executionRequest: SkillExecutionRequestDto): void;
}
