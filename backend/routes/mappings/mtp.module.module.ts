import { Module } from '@nestjs/common';

import { SkillModule } from '../skills/skill.module';
import { MtpModuleService } from './mtp.module.service';
import { MtpModuleController } from './mtp.module.controler';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [SkillModule, MulterModule.register({
        dest: './uploadedMtpOntology',
    })],
    controllers: [MtpModuleController],
    providers: [MtpModuleService],
})
export class MtpModuleModule {}
