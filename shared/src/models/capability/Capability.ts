import { RdfElementDto } from "../RdfElement";
import { FormulaConstraintDto, ValueConstraintDto } from "../constraints/ConstraintDto";
import { FpbElementDTO } from "../fpb/FpbElementDto";
import { SkillDto } from "../skill/Skill";


export class CapabilityDto extends RdfElementDto{
	public capabilityType: string;
    public processType?: string;
	public inputs?: Array<FpbElementDTO>;
	public outputs?: Array<FpbElementDTO>;
    public constraints?: Array<ValueConstraintDto | FormulaConstraintDto>;
    public skillDtos?: Array<SkillDto>;
}
