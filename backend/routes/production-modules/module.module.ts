import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { SkillModule } from '../skills/skill.module';

@Module({
    imports: [SkillModule],
    exports: [ModuleService],
    controllers: [ModuleController],
    providers: [ModuleService],
})
export class ModuleModule {}
