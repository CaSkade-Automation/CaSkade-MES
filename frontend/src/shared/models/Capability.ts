import { CapabilityDto } from "@shared/models/capability/Capability";
import { FpbElement } from "@shared/models/fpb/FpbElement";
import { RdfElement } from "@shared/models/RdfElement";
import { ServiceLocator } from "../services/service-locator.service";
import { SkillService } from "../services/skill.service";
import { Skill } from "./Skill";

export class Capability extends RdfElement {
    public inputs?: Array<FpbElement>;
    public outputs?: Array<FpbElement>;
    public skills? = new Array<Skill>();

    private skillService = ServiceLocator.injector.get(SkillService);

    constructor(dto: CapabilityDto) {
        super(dto.iri);
        this.inputs = dto.inputs.map(input => new FpbElement(input.iri));
        this.outputs = dto.outputs.map(output => new FpbElement(output.iri));
        dto.skillIris?.forEach(skillIri => {
            this.skillService.getSkillByIri(skillIri).subscribe(data => this.skills.push(data));
        });
    }
}
