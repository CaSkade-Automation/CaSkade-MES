import { SkillVariableDto } from './SkillVariable';

export class SkillDto {
    skillIri: string;
    capabilityIris: string[];
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
    capabilityIri: string,
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
