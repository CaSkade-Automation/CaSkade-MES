import { SkillExecutor } from '../SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { InternalServerErrorException } from '@nestjs/common';

export class NullSkillExecutor implements SkillExecutor {

    executeSkill(exeuctionRequest: SkillExecutionRequestDto): void {
        throw new InternalServerErrorException(`Transition '${exeuctionRequest.commandTypeIri}' of Skill '${exeuctionRequest.skillIri}'
        cannot be executed. There is no matching executor`);
    }

}
