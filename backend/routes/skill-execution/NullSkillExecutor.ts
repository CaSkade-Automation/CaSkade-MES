import { SkillExecutor } from './SkillExecutor';
import { SkillExecutionRequest } from './skill-execution.controller';

export class NullSkillExecutor implements SkillExecutor {

    executeSkill(exeuctionRequest: SkillExecutionRequest): void {
        throw new Error(`Transition '${exeuctionRequest.transitionIri}' of Skill '${exeuctionRequest.skillIri}'
        cannot be executed. There is no matching executor`);
    }

}
