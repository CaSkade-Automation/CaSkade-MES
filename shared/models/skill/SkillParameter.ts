import { RdfElement } from "../RdfElement";

export class SkillParameter extends RdfElement {
    name: string;
    type: string;
    required: boolean;
    default?: any;
    value?: any;
    optionValues? = new Array<any>();

    constructor(paramDto: SkillParameterDto) {
        super(paramDto.parameterIri)
        this.name = paramDto.parameterName;
        this.type = paramDto.parameterType;
        this.required = paramDto.parameterRequired;
        this.default = paramDto.parameterDefault;
        this.optionValues = paramDto.parameterOptionValues;
    }
}


export class SkillParameterDto {
    parameterIri: string;
    parameterName: string;
    parameterType: string;
    parameterRequired: boolean;
    parameterDefault?: any;
    parameterValue?: any;
    parameterOptionValues?: any[];
}
