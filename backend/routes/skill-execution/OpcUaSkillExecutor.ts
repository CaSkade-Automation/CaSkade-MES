import { SkillExecutor } from './SkillExecutor';
import { SkillExecutionRequest } from './skill-execution.controller';

export class OpcUaSkillExecutionService implements SkillExecutor{

    executeSkill(exeuctionRequest: SkillExecutionRequest): void {
        throw new Error("Method not implemented.");
    }

}
