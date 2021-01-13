import { Module, forwardRef } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { CapabilityModule } from '../capabilities/capability.module';
import { SkillExecutionModule } from '../skill-execution/skill-execution.module';
import { SkillConsistency } from './skill.consistency';

@Module({
    imports: [
        forwardRef(() => CapabilityModule),
        forwardRef(() => SkillExecutionModule)
    ],
    controllers: [SkillController],
    providers: [SkillService, SkillConsistency],
    exports: [SkillService, SkillConsistency],
})
export class SkillModule {}
