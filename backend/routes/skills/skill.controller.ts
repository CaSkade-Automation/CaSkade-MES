import { Controller, Get, Param, Post, Delete, Put, Body, Patch } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillDto } from '../../../shared/models/skill/Skill';
import { StringBody } from '../../custom-decorators/StringBodyDecorator';
import { SkillParameterDto } from '../../../shared/models/skill/SkillParameter';
import { SkillExecutorFactory } from '../skill-execution/skill-executor-factory.service';

@Controller('/skills')
export class SkillController {
    constructor(private skillService: SkillService,
        private executorFactory: SkillExecutorFactory) {}

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

    @Put(':skillIri/parameters')
    async setSkillParameters(@Param('skillIri') skillIri: string, @Body() parameters:SkillParameterDto[]) {
        const skillExecutor = await this.executorFactory.getSkillExecutor(skillIri);
        skillExecutor.setSkillParameters(skillIri, parameters);
    }

    @Patch(':skillIri/states')
    async updateSkillState(@Param('skillIri') skillIri: string, @Body() newState) {
        console.log(newState);
    }

    @Delete(':skillIri')
    deleteSkill(@Param('skillIri') skillIri: string): Promise<string> {
        return this.skillService.deleteSkill(skillIri);
    }
}
