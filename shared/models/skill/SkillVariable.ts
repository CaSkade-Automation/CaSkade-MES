import { RdfElement } from "../RdfElement";

export class SkillVariable extends RdfElement {
    name: string;
    type: string;
    required: boolean;
    default?: any;
    value?: any;
    optionValues? = new Array<any>();

    constructor(paramDto?: SkillVariableDto) {
        super(paramDto.iri)
        this.name = paramDto.name;
        this.type = paramDto.type;
        this.required = paramDto.required;
        this.default = paramDto.default;
        this.optionValues = paramDto.optionValues;
    }

    static fromParameterQueryResult(queryResult: ParameterQueryResult) {
        return new this(
            new SkillVariableDto(
                queryResult.parameterIri,
                queryResult.parameterName,
                queryResult.parameterType,
                queryResult.parameterRequired,
                queryResult.parameterDefault,
                queryResult.parameterOptionValues))
    }

    toSkillParameterDto(): SkillVariableDto {
        return {
            iri: super.iri,
            name: this.name,
            required: this.required,
            type: this.type,
            default: this.default,
            value: this.value,
            optionValues: this.optionValues
            }
    }
}


export class SkillVariableDto {
    iri: string;
    name: string;
    type: string;
    required: boolean;
    default?: any;
    value?: any;
    optionValues?: any[];

    constructor(iri: string, name: string, type: string, required: boolean, defaultValue: any, options: any[]) {
        this.iri = iri;
        this.name = name;
        this.type = type;
        this.required = required;
        this.default = defaultValue;

        if(options && options.length > 0) {
            this.optionValues = options.map(option => option.value);
        }
    }
}


export interface ParameterQueryResult {
    parameterIri: string,
    parameterName: string,
    parameterType: string,
    parameterRequired: boolean,
    parameterDefault: any,
    parameterOptionValues: any []
}

export interface OutputQueryResult {
    outputIri: string,
    outputName: string,
    outputType: string,
    outputRequired: boolean,
    outputDefault: any,
    outputOptionValues: any []
}
