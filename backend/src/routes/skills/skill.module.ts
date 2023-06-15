import { Module, forwardRef } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { SkillExecutionModule } from '../skill-execution/skill-execution.module';
import { CapabilityModule } from '../capabilities/capability.module';
import { SkillStateModule } from '../skill-states/skilll-state.modules';
import { OpcUaModule } from '../../util/opcua.module';

@Module({
    imports: [
    forwardRef(() => SkillExecutionModule),
    forwardRef(() => CapabilityModule),
    SkillStateModule,
    OpcUaModule
    ],
    controllers: [SkillController],
    providers: [SkillService],
    exports: [SkillService],
    })
export class SkillModule {}
