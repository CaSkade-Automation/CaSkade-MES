import { Module } from '@nestjs/common';
import { CapabilityController } from './capability.controller';
import { CapabilityService } from './capability.service';

@Module({
    imports: [],
    controllers: [CapabilityController],
    providers: [CapabilityService],
    exports: [CapabilityService],
})
export class CapabilityModule {}
