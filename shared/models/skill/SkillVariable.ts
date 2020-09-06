import { RdfElement } from "../RdfElement";

export class SkillVariable extends RdfElement {
    name: string;
    type: string;
    required: boolean;
    default?: any;
    value?: any;
    optionValues? = new Array<any>();

    constructor(paramDto: SkillVariableDto) {
        super(paramDto.iri)
        this.name = paramDto.name;
        this.type = paramDto.type;
        this.required = paramDto.required;
        this.default = paramDto.default;
        this.optionValues = paramDto.optionValues;
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
        console.log("skillParamDto");
        console.log(name);
        console.dir(options, {depth: null});

        if(options && options.length > 0) {
            this.optionValues = options.map(option => option.value);
        }
    }
}
