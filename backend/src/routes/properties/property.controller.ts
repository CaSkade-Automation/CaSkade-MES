import { Controller, Get, Param, Query } from "@nestjs/common";
import { PropertyDto } from "@shared/models/properties/PropertyDto";
import { PropertyService } from "./property.service";

@Controller('/properties')
export class PropertyController {

    constructor(
        private propertyService: PropertyService
    ) {}

    /**
     * Get all properties (of all capabilities) that are currently registered
     */
    @Get()
    getAllProperties(): Promise<Array<PropertyDto>> {
        return this.propertyService.getAllProperties();
    }

    /**
     * Get a specific property by its IRI
     * @param propertyIri IRI of the property to get
     */
    @Get(':propertyIri')
    getPropertyByIri(@Param('propertyIri') propertyIri: string): Promise<PropertyDto> {
        return this.propertyService.getPropertyByIri(propertyIri);
    }


    /**
     * Returns all properties of a given capability
     * @param capabilityIri: IRI of the capability to find properties of
     */
    @Get('')
    getSkillsOfCapability(@Query('capabilityIri') capabilityIri: string): Promise<PropertyDto[]>{
        return this.propertyService.getPropertiesOfCapability(capabilityIri);
    }

}
