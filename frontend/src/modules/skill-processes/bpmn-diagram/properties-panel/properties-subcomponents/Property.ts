import { SkillService } from "src/shared/services/skill.service";
import { Isa88CommandTypeIri } from "@shared/models/state-machine/ISA88/ISA88CommandTypeIri";

export abstract class BaseProperty {
    value: string | number;
    key: string;
    label: string;                              // natural language text describing the property
    required: boolean;                          // indicates whether or not this property is required
    readonly: boolean;
    order: number;                              // can be used to arrange properties in a certain order
    controlType: string;                        // determines the type of control that is displayed (e.g. input, select, ...)
    type: string;                               // determines the type of content (text, email, number, ...)
    options: {key: string; value: string | number}[];         // list of options (mainly for select)

    constructor(propertyOptions: PropertyOptions = {}, controlType: string, type: string, readonly: boolean) {
        this.value = propertyOptions.value;
        this.key = propertyOptions.key || '';
        this.label = propertyOptions.label || '';
        this.required = !!propertyOptions.required;
        this.order = propertyOptions.order === undefined ? 1 : propertyOptions.order;
        this.controlType = controlType || '';
        this.type = type || '';
        this.options = propertyOptions.options || [];
        this.readonly = readonly;
    }
}

export class ReadonlyProperty extends BaseProperty {
    constructor(propertyOptions: PropertyOptions) {
        super(propertyOptions, "readonly", "text", true);
    }
}

export class StringInputProperty extends BaseProperty {

    constructor(propertyOptions: PropertyOptions) {
        super(propertyOptions, "input", "text", false);
    }
}

export class SkillSelectionProperty extends BaseProperty {

    constructor(propertyOptions, skillService: SkillService) {
        super(propertyOptions, "select", "text", false);
        skillService.getAllSkills().subscribe(skills => {
            skills.forEach(skill => this.options.push({key: skill.iri, value: skill.iri}));
        });
    }
}

export class CommandTypeSelectionProperty extends BaseProperty {
    constructor(propertyOptions: PropertyOptions) {
        super(propertyOptions, "select", "text", false);
        for (const commandTypeIriKey in Isa88CommandTypeIri) {
            if (Object.prototype.hasOwnProperty.call(Isa88CommandTypeIri, commandTypeIriKey)) {
                const commandTypeIri = Isa88CommandTypeIri[commandTypeIriKey];
                this.options.push({key: commandTypeIriKey, value: commandTypeIri});
            }
        }
    }
}


interface PropertyOptions {
    value?: string | number;
    key?: string;
    label?: string;
    required?: boolean;
    order?: number;
    options?: {key: string; value: string | number}[];
}
