import { SkillExecutor } from './SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';

export class RestSkillExecutionService implements SkillExecutor {

    executeSkill(exeuctionRequest: SkillExecutionRequestDto): void {
        throw new Error("Method not implemented.");
    }

}
