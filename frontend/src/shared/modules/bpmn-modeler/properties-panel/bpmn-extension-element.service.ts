import { Injectable } from '@angular/core';
import * as InputOutputHelper from 'bpmn-js-properties-panel/lib/helper/InputOutputHelper';
import * as ExtensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';
import { BpmnDataModel, BpmnElement, BpmnProperty as CamundaProperty } from '../BpmnDataModel';
import { Observable, combineLatest, filter, map, startWith } from 'rxjs';

@Injectable()
export class BpmnExtensionElementService {

    bpmnElement$: Observable<BpmnElement>;
    bpmnElement: any;
    bpmnModeler: any;
    dataModel: BpmnDataModel;
    moddle: any;

    setup(bpmnModeler: any, bpmnElement$: Observable<any>) {
        this.bpmnModeler = bpmnModeler;
        this.bpmnElement$ = bpmnElement$;
        this.bpmnElement$.subscribe(elem => {
            this.bpmnElement = elem;
        });
        this.dataModel = new BpmnDataModel(this.bpmnModeler.get("modeling"));
        this.moddle = this.bpmnModeler.get("moddle");
    }

    getExtensionElements(): any{
        return this.bpmnElement.businessObject.extensionElements;
    }

    getInputParameters(): CamundaInputParameter[] {
        return InputOutputHelper.getInputParameters(this.bpmnElement) as CamundaInputParameter[];
    }

    getOutputParameters(): CamundaOutputParameter[] {
        return InputOutputHelper.getOutputParameters(this.bpmnElement) as CamundaInputParameter[];
    }

    updateBaseProperty(property: CamundaProperty): void {
        this.dataModel.updateProperty(this.bpmnElement, property);
    }

    /**
     * Updates a simple bpmn property (e.g. name, user task assignee)
     * @param property
     */
    updateCamundaProperty(property: CamundaProperty): void {
        const existingProperty = this.getCamundaProperty(property.name);

        let extensionElements = this.getExtensionElements();
        if (!extensionElements) {
            extensionElements = this.moddle.create('bpmn:ExtensionElements', { values: [] });
        }

        if(existingProperty) {
            existingProperty.value = property.value;

        } else {
            const camundaProperty = this.moddle.create('camunda:Property', { name: property.name, value: property.value });

            const prop = this.moddle.create('camunda:Properties', {
                values: [camundaProperty]
            });


            extensionElements.get("values").push(prop);
        }

        this.bpmnModeler.get("modeling").updateProperties(this.bpmnElement, {
            "extensionElements": extensionElements
        });
    }

    getCamundaProperties() {
        const camundaProperties = ExtensionElementsHelper.getExtensionElements(this.bpmnElement.businessObject, "camunda:Properties")[0];
        return camundaProperties;
    }

    getCamundaProperty(propertyName: string): CamundaProperty {
        try {
            const camundaProperties = ExtensionElementsHelper.getExtensionElements(this.bpmnElement.businessObject, "camunda:Properties")[0];
            const propertyValues = camundaProperties.values as Array<CamundaProperty> ?? [];
            const foundProperty = propertyValues.find(propertyValue => propertyValue.name == propertyName);
            console.log({foundProperty: foundProperty});
            return foundProperty;
        } catch (error) {
            return undefined;
        }
    }

    /**
     * Adds an input parameter to the current bpmn element
     * @param value Value to be set as input parameter
     */
    addCamundaInputParameter(prop: CamundaProperty): void {
        const stringVal = JSON.stringify(prop.value);

        const existingInputParameters = this.getInputParameters();
        const existingOutputParameters = this.getOutputParameters();

        try {
            // If this input parameter exists, set the new value
            const inputParameter = existingInputParameters.find(input => input.name == prop.name);

            inputParameter.value = JSON.stringify(prop.value);
            this.updateInputOutput(existingInputParameters, existingOutputParameters);
        } catch (error) {
            // In case it doesn't exist, create a new one
            const inputParameter = this.moddle.create('camunda:InputParameter', {
                name: `${prop.name}`,
                value: `${stringVal}`
            });
            const inputParameters = [...existingInputParameters, inputParameter];

            this.updateInputOutput(inputParameters, existingOutputParameters);
        }
    }

    setCamundaOutputParameters(props: Array<CamundaProperty>): void {
        // Get existing parameters to not overwrite them
        const existingInputParameters = this.getInputParameters();
        const outputParameters = new Array<CamundaOutputParameter>();
        // Create new output (note that ${name} has to be set as value so that the value is passed in by the engine)
        props.forEach(prop => {
            const newOutputParameter = this.moddle.create('camunda:OutputParameter', {
                name: `${prop.name}`,
                value: `${prop.value}`
            });
            outputParameters.push(newOutputParameter);
        });

        this.updateInputOutput(existingInputParameters, outputParameters);
    }

    updateInputOutput(inputs: Array<CamundaInputParameter>, outputs: Array<CamundaOutputParameter>): void {
        const inputOutput = this.moddle.create('camunda:InputOutput', {
            inputParameters: [...inputs],
            outputParameters: [...outputs]
        });
        const properties = this.getCamundaProperties();
        const extensionElements = this.moddle.create('bpmn:ExtensionElements', {
            values: [inputOutput, properties]
        });

        this.bpmnModeler.get("modeling").updateProperties(this.bpmnElement, {
            "extensionElements": extensionElements
        });
    }

    /**
     * Get an existing condition expression of the current bpmn element
     * @returns BPMN FormalExpression
     */
    public getFlowCondition(): string {
        // Try to get an existing expression. If it doesn't exist, return empty string
        try {
            let condition = this.bpmnElement.businessObject?.conditionExpression?.body as string;
            condition = condition.replace("${", "");
            condition = condition.replace("}", "");
            return condition;
        } catch (error) {
            return;
        }
    }

    /**
     * Adds a ConditionExpression to a flow element
     */
    public addFlowCondition(condition: string): void {
        const moddle = this.bpmnModeler.get("moddle");

        const conditionExpression = moddle.create('bpmn:FormalExpression', { body: condition });
        console.log(conditionExpression);

        this.bpmnModeler.get("modeling").updateProperties(this.bpmnElement, {
            conditionExpression: conditionExpression
        });
    }
}

class CamundaInputParameter {
    $type = "camunda:InputParameter";
    name: string;
    value: string | number | boolean | {}
}

export class CamundaOutputParameter {
    $type = "camunda:OutputParameter";
    name: string;
    value?: string | number | boolean | {}
}
