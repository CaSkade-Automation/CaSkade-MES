import { SkillExecutor } from './SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { InternalServerErrorException } from '@nestjs/common';
import { SkillVariableDto } from '@shared/models/skill/SkillVariable';

export class NullSkillExecutor implements SkillExecutor {
    setSkillParameters(skillIri: string, parameters: SkillVariableDto[]): void {
        throw new Error("Method not implemented.");
    }

    executeSkill(exeuctionRequest: SkillExecutionRequestDto): void {
        throw new InternalServerErrorException(`Transition '${exeuctionRequest.commandTypeIri}' of Skill '${exeuctionRequest.skillIri}'
        cannot be executed. There is no matching executor`);
    }

}
