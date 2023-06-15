import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { SkillModule } from '../skills/skill.module';
import { CapabilityModule } from '../capabilities/capability.module';
import { SkillStateModule } from '../skill-states/skilll-state.modules';

@Module({
    imports: [
    SkillModule,
    SkillStateModule,
    CapabilityModule
    ],
    exports: [ModuleService],
    controllers: [ModuleController],
    providers: [ModuleService],
    })
export class ModuleModule {}
