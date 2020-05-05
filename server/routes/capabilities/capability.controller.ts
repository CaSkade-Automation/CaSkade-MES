import { Controller, Get, Param, Delete, Post } from '@nestjs/common';
import { CapabilityService } from './capability.service';
import { Capability } from '../../../shared/models/capability/Capability';
import { StringBody } from 'custom-decorators/StringBodyDecorator';

@Controller('/capabilities')
export class CapabilityController {

    constructor(private capabilityService: CapabilityService) {}

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
    getAllCapabilities(): Promise<Array<Capability>> {
        return this.capabilityService.getAllCapabilities();
    }

    /**
     * Get a specific capability by its IRI
     * @param capabilityIri IRI of the capability to get
     */
    @Get(':capabilityIri')
    getCapabilityByIri(@Param('capabilityIri') capabilityIri: string): Promise<Capability> {
        return this.capabilityService.getCapabilityByIri(capabilityIri);
    }

    /**
     * Delete a specific capability with a given IRI
     * @param capabilityIri IRI of the capability to delete
     */
    @Delete(':capability')
    deleteCapability(@Param('capabilityIri') capabilityIri: string): Promise<string> {
        return this.capabilityService.deleteCapability(capabilityIri);
    }
}
