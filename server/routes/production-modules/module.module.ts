import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { CapabilityModule } from 'routes/capabilities/capability.module';

@Module({
    imports: [CapabilityModule],
    controllers: [ModuleController],
    providers: [ModuleService],
})
export class ModuleModule {}
