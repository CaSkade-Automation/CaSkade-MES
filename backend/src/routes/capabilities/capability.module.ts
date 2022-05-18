import { Module, forwardRef } from '@nestjs/common';
import { CapabilityController } from './capability.controller';
import { CapabilityService } from './capability.service';
import { SkillModule } from '../skills/skill.module';
import { PropertyModule } from '../properties/property.module';

@Module({
    imports: [
        PropertyModule,
        forwardRef(() => SkillModule)
    ],
    controllers: [CapabilityController],
    providers: [CapabilityService],
    exports: [CapabilityService],
})
export class CapabilityModule {}
