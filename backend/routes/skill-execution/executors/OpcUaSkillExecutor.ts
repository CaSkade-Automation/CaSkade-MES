import { SkillExecutor } from '../SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

export class OpcUaSkillExecutionService implements SkillExecutor{

    executeSkill(exeuctionRequest: SkillExecutionRequestDto): void {
        throw new InternalServerErrorException("Method not implemented.");
    }

}
