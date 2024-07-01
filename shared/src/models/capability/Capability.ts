import { RdfElementDto } from "../RdfElement";
import { FpbElementDTO } from "../fpb/FpbElementDTO";
import { SkillDto } from "../skill/Skill";


export class CapabilityDto extends RdfElementDto{
	public capabilityType: string;
    public processType?: string;
	public inputs?: Array<FpbElementDTO>;
	public outputs?: Array<FpbElementDTO>;
    public constraints?: Array<string>;
    public skillDtos?: Array<SkillDto>;
}
