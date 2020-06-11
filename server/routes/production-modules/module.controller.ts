import { Controller, Get, Post, Delete, Param, Logger } from '@nestjs/common';
import { ModuleService } from './module.service';
import { CapabilityService } from '../../routes/capabilities/capability.service';
import { ProductionModule } from '../../../shared/models/production-module/ProductionModule';
import { Capability } from '../../../shared/models/capability/Capability';
import { StringBody } from '../../custom-decorators/StringBodyDecorator';

@Controller('modules')
export class ModuleController {
    logger = new Logger(ModuleController.name)

    constructor(private moduleService: ModuleService, private capabilityService: CapabilityService) {}

    /**
     * Register a new module on the platform
     * @param req The complete request. @Body cannot be used because a string is sent
     */
    @Post()
    async addModule(@StringBody() newModule: string): Promise<string> {
        return this.moduleService.addModule(newModule);
    }

    @Get()
    async getAllModules(): Promise < Array < ProductionModule >> {
        this.logger.warn("Getting all modules");
        return this.moduleService.getAllModules();
    }

    @Get(':moduleIri')
    async getModuleByIri(@Param('moduleIri') moduleIri: string): Promise < ProductionModule > {
        return this.moduleService.getModuleByIri(moduleIri);
    }

    @Delete(':moduleIri')
    deleteModule(@Param('moduleIri') moduleIri: string): Promise<string> {
        return this.moduleService.deleteModule(moduleIri);
    }

    // TODO: Big To-Do here: Modules should only be able to add and delete their own capabilities.
    //       Currently, moduleIri is not checked

    /**
     * Add a new capability to a given module
     * @param moduleIri IRI of the module that this capability is added to
     * @param newCapability RDF document containing the new capability
     */
    @Post(':moduleIri/capabilities')
    addModuleCapability(@Param('moduleIri') moduleIri: string, @StringBody() newCapability: string): Promise<string> {
        return this.capabilityService.addCapability(newCapability);
    }

    /**
     * Get all capabilities of a module with a given IRI
     * @param moduleIri IRI of the module to get all capabilities from
     */
    @Get(':moduleIri/capabilities')
    getAllCapabilitiesOfModule(@Param('moduleIri') moduleIri: string): Promise<Array<Capability>> {
        return this.capabilityService.getCapabilitiesOfModule(moduleIri);
    }

    /**
     * Deletes a capability of a module
     * @param moduleIri IRI of the module whose capability is deleted
     * @param capabilityIri IRI of the capability that is deleted
     */
    @Delete(':moduleIri/capabilities/:capabilityIri')
    deleteCapability(@Param('moduleIri') moduleIri: string, @Param('capabilityIri') capabilityIri: string) {
        return this.capabilityService.deleteCapability(capabilityIri);
    }
}
