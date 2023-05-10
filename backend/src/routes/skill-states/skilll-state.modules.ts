import { Module, forwardRef } from '@nestjs/common';
import { SkillStateController } from './skill-state.controller';
import { SkillStateService } from './skill-state.service';

@Module({
    imports: [],
    controllers: [SkillStateController],
    providers: [SkillStateService],
    exports: [SkillStateService],
    })
export class SkillStateModule {}
