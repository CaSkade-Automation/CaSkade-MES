import { Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillDto } from '../../../shared/models/skill/Skill';
import { StringBody } from '../../custom-decorators/StringBodyDecorator';

@Controller('/skills')
export class SkillController {
    constructor(private skillService: SkillService) {}

    @Post()
    addSkill(@StringBody() newSkill: string): Promise<string> {
        return this.skillService.addSkill(newSkill);
    }

    @Get()
    getAllSkills(): Promise<Array<SkillDto>> {
        return this.skillService.getAllSkills();
    }

    @Get(':skillIri')
    getSkillByIri(@Param('skillIri') skillIri: string): Promise<SkillDto> {
        return this.skillService.getSkillByIri(skillIri);
    }

    @Delete(':skillIri')
    deleteSkill(@Param('skillIri') skillIri: string): Promise<string> {
        return this.skillService.deleteSkill(skillIri);
    }
}
