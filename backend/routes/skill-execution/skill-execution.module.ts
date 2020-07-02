import { Module } from '@nestjs/common';
import { SkillExecutionController } from './skill-execution.controller';
import { SkillExecutorFactory } from './skill-executor-factory.service';

@Module({
    imports: [],
    controllers: [SkillExecutionController],
    providers: [SkillExecutorFactory],
})
export class SkillExecutionModule {}
