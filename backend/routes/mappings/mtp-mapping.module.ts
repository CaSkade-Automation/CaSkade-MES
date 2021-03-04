import { Module } from '@nestjs/common';

import { SkillModule } from '../skills/skill.module';
import { MtpMappingController } from './mtp-mapping.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MtpMappingService } from './mtp-mapping.service';

@Module({
    imports: [SkillModule, MulterModule.register({
        dest: './uploadedMtpOntology',
    })],
    controllers: [MtpMappingController],
    providers: [MtpMappingService],
})
export class MtpMappingModule {}
