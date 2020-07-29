import { SkillExecutor } from './SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { InternalServerErrorException } from '@nestjs/common';
import { SkillParameterDto } from '@shared/models/skill/SkillParameter';

export class NullSkillExecutor implements SkillExecutor {
    setSkillParameters(parameters: SkillParameterDto[]): void {
        throw new Error("Method not implemented.");
    }

    executeSkill(exeuctionRequest: SkillExecutionRequestDto): void {
        throw new InternalServerErrorException(`Transition '${exeuctionRequest.commandTypeIri}' of Skill '${exeuctionRequest.skillIri}'
        cannot be executed. There is no matching executor`);
    }

}
