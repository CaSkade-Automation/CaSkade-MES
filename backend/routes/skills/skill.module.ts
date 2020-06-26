import { Module, forwardRef } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { CapabilityModule } from '../capabilities/capability.module';

@Module({
    imports: [
        forwardRef(() => CapabilityModule)
    ],
    controllers: [SkillController],
    providers: [SkillService],
    exports: [SkillService]
})
export class SkillModule {}
