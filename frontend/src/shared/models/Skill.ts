import { RdfElement } from "@shared/models/RdfElement";
import { SkillDto } from "@shared/models/skill/Skill";
import { SkillVariable } from "@shared/models/skill/SkillVariable";
import { Isa88StateMachineBuilder } from "@shared/models/state-machine/ISA88/ISA88StateMachineBuilder";
import { StateMachine } from "@shared/models/state-machine/StateMachine";
import { D3GraphData, D3Link, D3Node, D3Serializable, D3SkillNode, NodeType } from "../../modules/graph-visualization/D3GraphData";
import { CapabilityService } from "../services/capability.service";
import { ServiceLocator } from "../services/service-locator.service";
import { Capability } from "./Capability";

export class Skill extends RdfElement implements D3Serializable{
    public relatedCapabilities: Array<Capability>;
    public stateMachine: StateMachine;
    public skillType: RdfElement;
    public skillInterfaceType: RdfElement;
    public skillParameters = new Array<SkillVariable>();
    public skillOutputs = new Array<SkillVariable>();

    private capabilityService = ServiceLocator.injector.get(CapabilityService);

    constructor(skillDto: SkillDto) {
        super(skillDto.skillIri);
        this.skillType = new RdfElement(skillDto.skillType);
        this.skillInterfaceType = new RdfElement(skillDto.skillInterfaceType);
        this.stateMachine = Isa88StateMachineBuilder.buildDefault(skillDto.stateMachineIri, skillDto.currentStateTypeIri);

        if(skillDto.capabilityIris) {
            skillDto.capabilityIris.map(capIri => {
                this.capabilityService.getCapabilityByIri(capIri).subscribe(cap => this.relatedCapabilities.push(cap));
            });
        }

        if(skillDto.skillParameterDtos) {
            this.skillParameters = skillDto.skillParameterDtos.map(paramDto => new SkillVariable(paramDto));
        }
        if(skillDto.skillOutputsDtos) {
            this.skillOutputs = skillDto.skillOutputsDtos.map(outputDto => new SkillVariable(outputDto));
        }
    }

    /**
     * Checks whether or not a given capability is a capability that can be executed by this skill
     * @param capability The capability to check
     */
    public isRelatedCapability(capability: Capability): boolean {
        return this.relatedCapabilities.some(existingCap => existingCap.iri == capability.iri);
    }

    addRelatedCapability(capability: Capability): boolean {
        if(this.canBeExecutedBySkill(capability)) {
            this.relatedCapabilities.push(capability);
            return true;
        }
        return false;
    }

    // TODO: Implement a real check that e.g. checks
    public canBeExecutedBySkill(capability: Capability): boolean {
        return true;
    }

    toD3GraphData(): D3GraphData {
        const data = new D3GraphData();
        const skillNode = new D3SkillNode(this.iri,this.getLocalName());
        data.nodes.push(skillNode);

        // add state machine
        const stateMachineNode = new D3Node(this.stateMachine.iri, this.stateMachine.getLocalName(), NodeType.None);
        const link = new D3Link(skillNode, stateMachineNode, "hasStateMachine");
        data.addNodes([stateMachineNode]);
        data.addLinks([link]);

        return data;
    }


}
