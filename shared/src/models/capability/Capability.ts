import { RdfElementDto } from "../RdfElement";
import { FpbElementDTO } from "../fpb/FpbElementDTO";
import { SkillDto } from "../skill/Skill";


export class CapabilityDto extends RdfElementDto{
	public capabilityType: RdfElementDto;
	public inputs?: Array<FpbElementDTO>;
	public outputs?: Array<FpbElementDTO>;
    public skillDtos?: Array<SkillDto>;
}
