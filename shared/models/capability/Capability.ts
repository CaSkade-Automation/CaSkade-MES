import { RdfElement, RdfElementDto } from "../RdfElement";
import { FpbElement } from "../fpb/FpbElement";
import { Skill, SkillDto } from "../skill/Skill";

export class Capability extends RdfElement {
    public skills: Array<Skill>;
    public inputs?: Array<FpbElement>;
    public outputs?: Array<FpbElement>;

    constructor(dto: CapabilityDto) {
        super(dto.iri);
        this.inputs = dto.inputs;
        this.outputs = dto.outputs;
        this.skills = dto.skillDtos.map(skillDto => new Skill(skillDto));
    }

    addSkill(skill: Skill) {
        this.skills.push(skill);
    }

    addSkills(skills: Array<Skill>) {
        this.skills.push(...skills);
    }
}


export class CapabilityDto extends RdfElementDto{
    public skillDtos: Array<SkillDto>;
    public inputs?: Array<FpbElement>;
    public outputs?: Array<FpbElement>;
}
