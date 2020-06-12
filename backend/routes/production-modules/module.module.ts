import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { CapabilityModule } from '../../routes/capabilities/capability.module';
import { SkillModule } from '../skills/skill.module';

@Module({
    imports: [
        CapabilityModule,
        SkillModule
    ],
    controllers: [ModuleController],
    providers: [ModuleService],
})
export class ModuleModule {}
