import { Module } from '@nestjs/common';

import { MtpMappingController } from './mtp-mapping.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MtpMappingService } from './mtp-mapping.service';
import { ModuleModule } from '../../production-modules/module.module';
import { SkillModule } from '../../skills/skill.module';

@Module({
    imports: [
        ModuleModule,
        SkillModule,
        MulterModule.register({
            dest: './../uploaded-files/mtp',
        })],
    controllers: [MtpMappingController],
    providers: [MtpMappingService],
})
export class MtpMappingModule {}
