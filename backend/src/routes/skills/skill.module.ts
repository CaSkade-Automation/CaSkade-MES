import { Module, forwardRef } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { SkillExecutionModule } from '../skill-execution/skill-execution.module';

@Module({
    imports: [
        forwardRef(() => SkillExecutionModule),
    ],
    controllers: [SkillController],
    providers: [SkillService],
    exports: [SkillService],
})
export class SkillModule {}
