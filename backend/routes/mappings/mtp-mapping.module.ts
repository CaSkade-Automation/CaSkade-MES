import { Module } from '@nestjs/common';

import { MtpMappingController } from './mtp-mapping.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MtpMappingService } from './mtp-mapping.service';
import { ModuleModule } from '../production-modules/module.module';

@Module({
    imports: [
        ModuleModule,
        MulterModule.register({
            dest: './uploadedMtpOntology',
        })],
    controllers: [MtpMappingController],
    providers: [MtpMappingService],
})
export class MtpMappingModule {}
