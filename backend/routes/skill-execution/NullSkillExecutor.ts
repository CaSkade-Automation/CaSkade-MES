import { SkillExecutor } from './SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';

export class NullSkillExecutor implements SkillExecutor {

    executeSkill(exeuctionRequest: SkillExecutionRequestDto): void {
        throw new Error(`Transition '${exeuctionRequest.command}' of Skill '${exeuctionRequest.skill.skillIri}'
        cannot be executed. There is no matching executor`);
    }

}
