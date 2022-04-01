import { RdfElement } from "@shared/models/RdfElement";
import { SkillDto } from "@shared/models/skill/Skill";
import { SkillVariable } from "@shared/models/skill/SkillVariable";
import { Isa88StateMachineBuilder } from "@shared/models/state-machine/ISA88/ISA88StateMachineBuilder";
import { StateMachine } from "@shared/models/state-machine/StateMachine";
import { Capability } from "./Capability";

export class Skill extends RdfElement{
    public relatedCapabilities: Array<Capability>;
    public stateMachine: StateMachine;
    public skillParameters = new Array<SkillVariable>();
    public skillOutputs = new Array<SkillVariable>();

    constructor(skillDto: SkillDto) {
        super(skillDto.skillIri);
        this.stateMachine = Isa88StateMachineBuilder.buildDefault(skillDto.stateMachineIri, skillDto.currentStateTypeIri);

        if(skillDto.capabilityDtos) {
            this.relatedCapabilities = skillDto.capabilityDtos.map(capDto => new Capability(capDto));
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


}
