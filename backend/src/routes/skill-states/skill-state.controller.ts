import { Body, Controller, Param, Patch } from "@nestjs/common";
import { SkillStateService } from "./skill-state.service";

@Controller('/skills')
export class SkillStateController {

    constructor(private skillStateService: SkillStateService) {}

    @Patch(':skillIri/states')
    updateSkillState(@Param('skillIri') skillIri:string, @Body() change: Record<string, unknown>): Promise<string> {
        const newState = change['newState'] as string;
        return this.skillStateService.updateState(skillIri, newState);
    }
}
