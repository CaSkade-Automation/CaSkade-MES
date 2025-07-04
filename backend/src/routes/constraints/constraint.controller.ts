import { Controller, Get, Param } from '@nestjs/common';
import { ConstraintService } from './constraint.service';

@Controller('constraints')
export class ConstraintController {

    constructor (
        readonly constraintService: ConstraintService,
    ) {}

    @Get('')
    getAllConstraints() {
        return this.constraintService.getConstraints();
    }


    @Get(':capabilityIri')
    getConstraintsOfCapability(@Param('capabilityIri') capabilityIri: string) {
        return this.constraintService.getConstraintsOfCapability(capabilityIri);
    }

}
