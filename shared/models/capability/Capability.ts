import { RdfElement, RdfElementDto } from "../RdfElement";
import { FpbElement } from "../fpb/FpbElement";


export class CapabilityDto extends RdfElementDto{
	public capabilityType: RdfElementDto;
	public inputs?: Array<RdfElementDto>;
	public outputs?: Array<RdfElementDto>;
    public skillIris?: Array<string>;
}
