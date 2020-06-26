import { RdfElement } from '../RdfElement';
import { StateMachine } from '../state-machine/StateMachine';
import { Isa88StateMachineBuilder } from '../state-machine/ISA88/ISA88StateMachineBuilder';
import { Capability, CapabilityDto } from '../capability/Capability';
import { SkillParameter } from './SkillParameter';

export class Skill extends RdfElement{
    public relatedCapabilities: Array<Capability>;
    public stateMachine: StateMachine;
    public skillParameters: Array<SkillParameter>;
    public skillResults: Array<SkillParameter>;

    constructor(skillDto: SkillDto) {
        super(skillDto.skillIri);
        this.relatedCapabilities = skillDto.capabilityDtos.map(capDto => new Capability(capDto));
        this.stateMachine = Isa88StateMachineBuilder.buildDefault(skillDto.stateMachineIri, skillDto.currentStateTypeIri);
        this.skillParameters = skillDto.skillParameters;
        this.skillResults = skillDto.skillResults;
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

export class SkillDto {
    skillIri: string;
    capabilityDtos: CapabilityDto[];
    skillParameters: SkillParameter[];
    skillResults: SkillParameter[];
    stateMachineIri: string;
    currentStateTypeIri: string;
}
