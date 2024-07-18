import { CapabilityDto } from "@shared/models/capability/Capability";
import { RdfElement } from "@shared/models/RdfElement";
import { D3CapabilityNode, D3GraphData, D3Link, D3Serializable, NodeType } from "../../modules/graph-visualization/D3GraphData";
import { FpbElement } from "./FpbElement";
import { Property } from "./Property";
import { Skill } from "./Skill";
import { FormulaConstraint, ValueConstraint } from "./Constraint";

export class Capability extends RdfElement implements D3Serializable {
    public capabilityType?: RdfElement;
    public processType = new RdfElement("http://www.w3id.org/hsu-aut/css#Capability"); // Set "Capability as default processType"
    public inputs?: Array<FpbElement>;
    public outputs?: Array<FpbElement>;
    public constraints?: Array<ValueConstraint | FormulaConstraint>;
    public skills? = new Array<Skill>();

    constructor(dto: CapabilityDto) {
        super(dto.iri);
        this.capabilityType = new RdfElement(dto.capabilityType);
        this.constraints = dto.constraints.map(constraintDto => {
            if (constraintDto.type == "ValueConstraint") return new ValueConstraint(constraintDto);
            if (constraintDto.type == "FormulaConstraint") return new FormulaConstraint(constraintDto);
        }) || [];
        this.inputs = dto.inputs.map(inputDto => new FpbElement(inputDto)) || [];
        this.outputs = dto.outputs.map(outputDto => new FpbElement(outputDto))  || [];
        if(dto.processType) this.processType = new RdfElement(dto.processType);
        dto.skillDtos?.forEach(skillDto => {
            this.skills.push(new Skill(skillDto));
        });
    }

    /**
     * Convenience getter to get all input properties
     */
    get inputProperties(): Array<Property>  {
        const init = new Array<Property>();
        const inputProperties = this.inputs?.reduce((previousInput, currentInput) => {
            if(currentInput.properties) {
                init.push(...currentInput.properties);
            }
            return init;
        }, init);

        return inputProperties;
    }

    /**
     * Convenience getter to get all output properties
     */
    get outputProperties(): Array<Property>  {
        const init = new Array<Property>();
        const outputProperties = this.outputs?.reduce((previousOutput, currentOutput) => {
            if(currentOutput.properties) {
                init.push(...currentOutput.properties);
            }
            return init;
        }, init);

        return outputProperties;
    }

    toD3GraphData(): D3GraphData {
        const data = new D3GraphData();
        const capabilityNode = new D3CapabilityNode(this.iri,this.getLocalName());
        data.nodes.push(capabilityNode);

        this.skills.forEach(skill => {
            const skillData = skill.toD3GraphData();
            data.addData(skillData);
            const skillNodes = skillData.nodes.filter(node => node.type == NodeType.Skill);
            skillNodes.forEach(skillNode => {
                const link = new D3Link(capabilityNode, skillNode, "isExecutableVia");
                data.addLinks([link]);
            });
        });

        return data;
    }
}
