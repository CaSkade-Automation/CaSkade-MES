import { SkillExecutionRequest } from "./skill-execution.controller";

export interface SkillExecutor {
    executeSkill(executionRequest: SkillExecutionRequest): void;
}
