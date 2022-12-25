import { Controller, Get, Post, Delete, Param, Patch, Body, Headers, Header } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ProductionModuleDto } from '@shared/models/production-module/ProductionModule';
import { StringBody } from '../../custom-decorators/StringBodyDecorator';
import { SkillDto } from '@shared/models/skill/Skill';
import { SkillService } from '../skills/skill.service';
import { CapabilityDto } from '@shared/models/capability/Capability';
import { CapabilityService } from '../capabilities/capability.service';

@Controller('modules')
export class ModuleController {

    constructor(
        private moduleService: ModuleService,
        private capabilityService: CapabilityService,
        private skillService: SkillService) {}

    /**
     * Register a new module on the platform
     * @param newModule RDF document describing the new module
     * @param contentType Encoding of the document
     * @returns A simple response
     */
    @Post() // TODO: Check if this return makes sense, could also be void
    async addModule(@StringBody() newModule: string, @Headers("Content-Type") contentType: string): Promise<Record<string, string>> {
        return this.moduleService.addModule(newModule, contentType);
    }

    /**
     * Get all modules that are currently registered
     * @returns A list of modules
     */
    @Get()
    async getAllModules(): Promise<Array<ProductionModuleDto>> {
        return this.moduleService.getModules();
    }

    /**
     * Get all information of a single module with a given IRI
     * @param moduleIri IRI of the module to retrieve information of
     * @returns Complete module information of the module with the given IRI
     */
    @Get(':moduleIri')
    async getModuleByIri(@Param('moduleIri') moduleIri: string): Promise<ProductionModuleDto> {
        return this.moduleService.getModuleByIri(moduleIri);
    }


    /**
     * Delete a registered module with a given IRI
     * @param moduleIri IRI of the module that should be deleted
     */
    @Delete(':moduleIri')
    deleteModule(@Param('moduleIri') moduleIri: string): Promise<void> {
        return this.moduleService.deleteModule(moduleIri);
    }


    /**
     * Add a new skill to a given module
     * @param moduleIri IRI of the module that this skill is added to
     * @param newSkill RDF document containing the new skill
     * @param contentType Encoding of the rdf document
     */
    @Post(':moduleIri/skills')
    addModuleSkill(
        @Param('moduleIri') moduleIri: string,
        @StringBody() newSkill: string,
        @Headers("Content-Type") contentType?: string): Promise<string> {
        // TODO: Make sure that the skill is registered with the given module. This is currently not checked
        return this.skillService.addSkill(newSkill, contentType);
    }


    /**
     * Get all skills of a module with a given IRI
     * @param moduleIri IRI of the module to get all skills from
     * @returns Array of skills of the module
     */
    @Get(':moduleIri/skills')
    getAllSkillsOfModule(@Param('moduleIri') moduleIri: string): Promise<Array<SkillDto>> {
        return this.skillService.getSkillsOfModule(moduleIri);
    }


    /**
     * Get all skills of a module with a given IRI
     * @param moduleIri IRI of the module to get all skills from
     * @returns Array of skills of the module
     */



    @Get(':moduleIri/capabilities')
    getAllCapabilitiesOfModule(@Param('moduleIri') moduleIri: string): Promise<Array<CapabilityDto>> {
        return this.capabilityService.getCapabilitiesOfModule(moduleIri);
    }


    /**
     * Deletes a skill of a module
     * @param moduleIri IRI of the module whose skill is deleted
     * @param skillIri IRI of the skill that is deleted
     */
    @Delete(':moduleIri/skills/:skillIri')
    deleteModuleSkill(@Param('moduleIri') moduleIri: string, @Param('skillIri') skillIri: string): Promise<void>  {
        // TODO: It should be checked that a module can only delete its own skills (i.e. that the deleted skill is connected with the given IRI)
        return this.skillService.deleteSkill(skillIri);
    }

    // TODO: This is currently pretty bad as only the state is changed (should be dynamic to change other aspects if needed)
    // Furthermore, it is currently only used to update the currentState. It should be checked what is changed before calling a skillmethod
    @Patch(':moduleIri/skills/:skillIri')
    updateSkillState(@Param('skillIri') skillIri:string, @Body() change: Record<string, unknown>): Promise<string> {
        const newState = change['newState'] as string;
        return this.skillService.updateState(skillIri, newState);
    }
}
