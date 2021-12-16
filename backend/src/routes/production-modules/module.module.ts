import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { SkillModule } from '../skills/skill.module';
import { CapabilityModule } from '../capabilities/capability.module';

@Module({
    imports: [
        SkillModule,
        CapabilityModule
    ],
    exports: [ModuleService],
    controllers: [ModuleController],
    providers: [ModuleService],
})
export class ModuleModule {}
