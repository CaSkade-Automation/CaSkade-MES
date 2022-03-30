import { CapabilityDto } from "@shared/models/capability/Capability";
import { RdfElement } from "@shared/models/RdfElement";
import { ServiceLocator } from "../services/service-locator.service";
import { SkillService } from "../services/skill.service";
import { FpbElement } from "./FpbElement";
import { Property } from "./Property";
import { Skill } from "./Skill";

export class Capability extends RdfElement {
    public inputs?: Array<FpbElement>;
    public outputs?: Array<FpbElement>;
    public skills? = new Array<Skill>();

    private skillService = ServiceLocator.injector.get(SkillService);

    constructor(dto: CapabilityDto) {
        super(dto.iri);
        this.inputs = dto.inputs.map(inputDto => new FpbElement(inputDto));
        this.outputs = dto.outputs.map(outputDto => new FpbElement(outputDto));
        dto.skillIris?.forEach(skillIri => {
            this.skillService.getSkillByIri(skillIri).subscribe(data => this.skills.push(data));
        });
    }

    /**
     * Convenience getter to get all input properties
     */
    get inputProperties(): Array<Property>  {
        const init = new Array<Property>();
        const inputProperties = this.inputs.reduce((previousInput, currentInput) => {
            init.push(...currentInput.properties);
            return init;
        }, init);

        return inputProperties;
    }

    /**
     * Convenience getter to get all output properties
     */
    get outputProperties(): Array<Property>  {
        const init = new Array<Property>();
        const outputProperties = this.outputs.reduce((previousOutput, currentOutput) => {
            init.push(...currentOutput.properties);
            return init;
        }, init);

        return outputProperties;
    }
}