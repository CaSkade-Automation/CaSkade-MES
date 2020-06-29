import { Skill, SkillDto } from "./Skill";
import { Transition } from "../state-machine/Transition";
import { SkillParameter } from "./SkillParameter";

export class SkillExecutionRequest {

}

export class SkillExecutionRequestDto {
    skill: SkillDto;
    command: Transition;
    parameters: SkillParameter[];
}
