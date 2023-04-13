import { Controller, Get, Param, Delete, Post, Query, NotImplementedException } from '@nestjs/common';
import { CapabilityService } from './capability.service';
import { CapabilityDto } from '@shared/models/capability/Capability';
import { StringBody } from '../../custom-decorators/StringBodyDecorator';
import { SkillService } from '../skills/skill.service';
import { SkillDto } from '@shared/models/skill/Skill';

@Controller('/capabilities')
export class CapabilityController {

    constructor(
        private capabilityService: CapabilityService,
        private skillService: SkillService) {}

    /**
     * Register a new capability
     * @param newCapability RDF document containing the new capability that is going to be registered
     */
    @Post()
    addCapability(@StringBody() newCapability: string): Promise<string> {
        return this.capabilityService.addCapability(newCapability);
    }

    /**
     * Get all capabilities that are currently registered
     */
    @Get()
    getAllCapabilities(@Query("type") type?: string): Promise<Array<CapabilityDto>> {
        return this.capabilityService.getAllCapabilities(type);
    }

    /**
     * Get a specific capability by its IRI
     * @param capabilityIri IRI of the capability to get
     */
    @Get(':capabilityIri')
    getCapabilityByIri(@Param('capabilityIri') capabilityIri: string): Promise<CapabilityDto> {
        return this.capabilityService.getCapabilityByIri(capabilityIri);
    }


    /**
     * Returns all skills that are suited for a given capability
     * @param capabilityIri: IRI of the capability to find skills for
     */
    @Get(':capabilityIri/skills')
    getSkillsOfCapability(@Param('capabilityIri') capabilityIri: string): Promise<SkillDto[]>{
        return this.skillService.getSkillsForCapability(capabilityIri);
    }

    /**
     * Delete a specific capability with a given IRI
     * @param capabilityIri IRI of the capability to delete
     */
    @Delete(':capabilityIri')
    deleteCapability(@Param('capabilityIri') capabilityIri: string): Promise<void> {
        return this.capabilityService.deleteCapability(capabilityIri);
    }
}
