import { SkillVariableDto } from './SkillVariable';

export class SkillDto {
    skillIri: string;
    capabilityIris: string[];
    skillType: string;
    skillInterfaceType: string;
    skillParameterDtos?: SkillVariableDto[];
    skillOutputsDtos?: SkillVariableDto[];
    stateMachineIri: string;
    currentStateTypeIri: string;

    constructor(queryResult: SkillQueryResult) {
        this.skillIri = queryResult.skillIri;
        this.capabilityIris = queryResult.capabilityIris.map(capabilityIris => capabilityIris.iri);
        this.stateMachineIri = queryResult.stateMachine;
        this.skillType = queryResult.skillType;
        this.skillInterfaceType = queryResult.skillInterfaceType;
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
    capabilityIris: {iri: string}[],
    skillType: string,
    skillInterfaceType: string,
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
