import { Controller, Get, Post, Delete, Param, Logger, Patch, Body } from '@nestjs/common';
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
     * @param newModule: Turtle document describing the new module
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

    // TODO: It should be checked that a module can only delete its own skills
    /**
     * Deletes a skill of a module
     * @param moduleIri IRI of the module whose skill is deleted
     * @param skillIri IRI of the skill that is deleted
     */
    @Delete(':moduleIri/skills/:skillIri')
    deleteModuleSkill(@Param('moduleIri') moduleIri: string, @Param('skillIri') skillIri: string): Promise<string>  {
        return this.skillService.deleteSkill(skillIri);
    }

    // TODO: This is pretty bad...
    // Furthermore, it is currently only used to update the currentState. It should be checked what is changed before calling a skillmethod
    @Patch(':moduleIri/skills/:skillIri')
    updateSkillState(@Param('skillIri') skillIri:string, @Body() change: Record<string, unknown>): Promise<string> {
        const newState = change['newState'] as string;
        return this.skillService.updateState(skillIri, newState);
    }
}
