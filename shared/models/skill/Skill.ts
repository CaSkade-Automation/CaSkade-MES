import { RdfElement } from '../RdfElement';
import { StateMachine } from '../state-machine/StateMachine';
import { Isa88StateMachineBuilder } from '../state-machine/ISA88/ISA88StateMachineBuilder';
import { Capability, CapabilityDto } from '../capability/Capability';
import { SkillVariable, SkillVariableDto } from './SkillVariable';

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

export class SkillDto {
    skillIri: string;
    capabilityDtos: CapabilityDto[];
    skillParameterDtos?: SkillVariableDto[];
    skillOutputsDtos?: SkillVariableDto[];
    stateMachineIri: string;
    currentStateTypeIri: string;

    constructor(queryResult: SkillQueryResult) {
        this.skillIri = queryResult.skillIri;
        this.stateMachineIri = queryResult.stateMachine;
        this.currentStateTypeIri = queryResult.currentStateTypeIri;
        if(queryResult.skillParameters) {
            this.skillParameterDtos = queryResult.skillParameters.map(param => new SkillVariableDto(param.parameterIri,
                param.parameterName, param.parameterType, param.parameterRequired, param.parameterDefault, param.parameterOptionValues));
        }
        if(queryResult.skillOutputs) {
            this.skillOutputsDtos = queryResult.skillOutputs.map(output => new SkillVariableDto(output.outputIri,
                output.outputName, output.outputType, output.outputRequired, output.outputDefault, output.outputOptionValues));
        }
    }
}

export interface SkillQueryResult {
    skillIri: string,
    stateMachine: string,
    currentStateTypeIri: string,
    skillParameters: {
        parameterIri: string,
        parameterName: string,
        parameterType: string,
        parameterRequired: boolean
        parameterDefault: any;
        parameterOptionValues: {
            value : any
        }[]
    }[],
    skillOutputs: {
        outputIri: string,
        outputName: string,
        outputType: string,
        outputRequired: boolean
        outputDefault: any;
        outputOptionValues: {
            value : any
        }[]
    }[]
}
