import { RdfElement } from "../RdfElement";
import { FpbElement } from "../fpb/FpbElement";
import { Skill } from "../skill/Skill";

export class Capability extends RdfElement {
    constructor(
        iri: string,
        public inputs?: Array<FpbElement>,
        public outputs?: Array<FpbElement>,
        public skills = new Array<Skill>()
    ) {
        super(iri);
    }

    addSkill(skill: Skill) {
        this.skills.push(skill);
    }

    addSkills(skills: Array<Skill>) {
        this.skills.push(...skills);
    }
}
