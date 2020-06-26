import { Module, forwardRef } from '@nestjs/common';
import { CapabilityController } from './capability.controller';
import { CapabilityService } from './capability.service';
import { SkillModule } from '../skills/skill.module';

@Module({
    imports: [forwardRef(() => SkillModule)],
    controllers: [CapabilityController],
    providers: [CapabilityService],
    exports: [CapabilityService],
})
export class CapabilityModule {}
