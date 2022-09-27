import { RdfElementDto } from "../RdfElement";
import { FpbElementDTO } from "../fpb/FpbElementDTO";


export class CapabilityDto extends RdfElementDto{
	public capabilityType: RdfElementDto;
	public inputs?: Array<FpbElementDTO>;
	public outputs?: Array<FpbElementDTO>;
    public skillIris?: Array<string>;
}
