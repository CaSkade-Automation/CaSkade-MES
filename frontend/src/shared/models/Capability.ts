import { CapabilityDto } from "@shared/models/capability/Capability";
import { RdfElement } from "@shared/models/RdfElement";
import { D3CapabilityNode, D3GraphData, D3Link, D3Serializable, D3SkillNode, NodeType } from "../../modules/graph-visualization/D3GraphData";
import { ServiceLocator } from "../services/service-locator.service";
import { SkillService } from "../services/skill.service";
import { FpbElement } from "./FpbElement";
import { Property } from "./Property";
import { Skill } from "./Skill";

export class Capability extends RdfElement implements D3Serializable {
    public inputs?: Array<FpbElement>;
    public outputs?: Array<FpbElement>;
    public skills? = new Array<Skill>();

    private skillService = ServiceLocator.injector.get(SkillService);

    constructor(dto: CapabilityDto) {
        super(dto.iri);
        this.inputs = dto.inputs.map(inputDto => new FpbElement(inputDto));
        this.outputs = dto.outputs.map(outputDto => new FpbElement(outputDto));
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
