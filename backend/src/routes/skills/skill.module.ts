import { Module, forwardRef } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { CapabilityModule } from '../capabilities/capability.module';
import { SkillExecutionModule } from '../skill-execution/skill-execution.module';

@Module({
    imports: [
        forwardRef(() => CapabilityModule),
        forwardRef(() => SkillExecutionModule),
    ],
    controllers: [SkillController],
    providers: [SkillService],
    exports: [SkillService],
})
export class SkillModule {}
