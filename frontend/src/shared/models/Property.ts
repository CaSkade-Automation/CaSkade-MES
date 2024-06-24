import { ExpressionGoal, PropertyDTO, PropertyInstanceDto } from "@shared/models/properties/PropertyDTO";
import { RdfElement } from "@shared/models/RdfElement";

export class PropertyInstance extends RdfElement{
    logicInterpretation: string;
    expressionGoal: ExpressionGoal;
    value?: string;

    constructor(dto: PropertyInstanceDto) {
        super(dto.propertyInstanceIri);
        this.logicInterpretation = dto.logicInterpretation;
        this.expressionGoal = dto.expressionGoal;
        this.value = dto.value;
    }

    toDto(): PropertyInstanceDto {
        const dto: PropertyInstanceDto = {
            propertyInstanceIri: this.iri,
            logicInterpretation: this.logicInterpretation,
            expressionGoal: this.expressionGoal,
            value: this.value
        };
        return dto;
    }
}

export class Property extends RdfElement {
    parentElement: RdfElement;

    dataType: string;
    code?: string;
    definition: string;
    unit?: string;
    instances: Array<PropertyInstance>

    constructor(dto: PropertyDTO) {
        super(dto.propertyIri);
        this.parentElement = new RdfElement(dto.parentElement);
        this.dataType = dto.dataType;
        this.code = dto.code;
        this.definition = dto.definition;
        this.unit = dto.unit;
        this.instances = dto.instances.map(instanceDto => new PropertyInstance(instanceDto));
    }

    toDto(): PropertyDTO {
        const dto: PropertyDTO = {
            propertyIri: this.iri,
            dataType: this.dataType,
            code: this.code,
            definition: this.definition,
            unit: this.unit,
            parentElement: this.parentElement.iri,
            instances: this.instances.map(instance => instance.toDto())
        };
        return dto;
    }
}


