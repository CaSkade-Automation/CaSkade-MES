import { RdfElement, RdfElementDto } from "../RdfElement";
import { FpbElement } from "../fpb/FpbElement";

export class Capability extends RdfElement {
    public inputs?: Array<FpbElement>;
    public outputs?: Array<FpbElement>;
    public skillIri?: RdfElement;

    constructor(dto: CapabilityDto) {
        super(dto.iri);
        this.inputs = dto.inputs;
        this.outputs = dto.outputs;
        this.skillIri = new RdfElement(dto.skillIri);
    }
}


export class CapabilityDto extends RdfElementDto{
	public capabilityType: RdfElementDto;
	public inputs?: Array<FpbElement>;
	public outputs?: Array<FpbElement>;
    public skillIri?: string;
}
