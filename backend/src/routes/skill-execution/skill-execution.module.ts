import { Module, forwardRef } from '@nestjs/common';
import { SkillExecutionController } from './skill-execution.controller';
import { SkillExecutorFactory } from './skill-executor-factory.service';
import { SkillModule } from '../skills/skill.module';
import { OpcUaModule } from '../../util/opcua.module';

@Module({
    imports: [
    forwardRef(() => SkillModule),
    OpcUaModule
    ],
    controllers: [SkillExecutionController],
    providers: [SkillExecutorFactory],
    exports: [SkillExecutorFactory]
    })
export class SkillExecutionModule {}
