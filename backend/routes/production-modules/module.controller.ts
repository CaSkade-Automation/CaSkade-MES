import { Controller, Get, Post, Delete, Param, Logger } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ProductionModuleDto } from '@shared/models/production-module/ProductionModule';
import { StringBody } from '../../custom-decorators/StringBodyDecorator';
import { SkillDto } from '@shared/models/skill/Skill';
import { SkillService } from '../skills/skill.service';

@Controller('modules')
export class ModuleController {

    constructor(
        private moduleService: ModuleService,
        private skillService: SkillService) {}

    /**
     * Register a new module on the platform
     * @param req The complete request. @Body cannot be used because a string is sent
     */
    @Post()
    async addModule(@StringBody() newModule: string): Promise<string> {
        return this.moduleService.addModule(newModule);
    }

    @Get()
    async getAllModules(): Promise<Array<ProductionModuleDto>> {
        return this.moduleService.getAllModulesWithSkills();
    }

    @Get(':moduleIri')
    async getModuleByIri(@Param('moduleIri') moduleIri: string): Promise<ProductionModuleDto> {
        return this.moduleService.getModuleByIri(moduleIri);
    }

    @Delete(':moduleIri')
    deleteModule(@Param('moduleIri') moduleIri: string): Promise<string> {
        return this.moduleService.deleteModule(moduleIri);
    }

    // TODO: Big To-Do here: Modules should only be able to add and delete their own skills.
    //       Currently, moduleIri is not checked

    /**
     * Add a new skill to a given module
     * @param moduleIri IRI of the module that this skill is added to
     * @param newSkill RDF document containing the new skill
     */
    @Post(':moduleIri/skills')
    addModuleSkill(@Param('moduleIri') moduleIri: string, @StringBody() newSkill: string): Promise<string> {
        return this.skillService.addSkill(newSkill);
    }

    /**
     * Get all skills of a module with a given IRI
     * @param moduleIri IRI of the module to get all skills from
     */
    @Get(':moduleIri/skills')
    getAllSkillsOfModule(@Param('moduleIri') moduleIri: string): Promise<Array<SkillDto>> {
        return this.skillService.getSkillsOfModule(moduleIri);
    }

    /**
     * Deletes a skill of a module
     * @param moduleIri IRI of the module whose skill is deleted
     * @param skillIri IRI of the skill that is deleted
     */
    @Delete(':moduleIri/skills/:skillIri')
    deleteModuleSkill(@Param('moduleIri') moduleIri: string, @Param('skillIri') skillIri: string): Promise<string>  {
        return this.skillService.deleteSkill(skillIri);
    }
}
