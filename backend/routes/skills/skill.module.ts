import { Module } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';

@Module({
    imports: [],
    controllers: [SkillController],
    providers: [SkillService],
    exports: [SkillService]
})
export class SkillModule {}
