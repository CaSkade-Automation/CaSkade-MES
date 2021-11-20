import { Injectable } from '@angular/core';
import * as InputOutputHelper from 'bpmn-js-properties-panel/lib/helper/InputOutputHelper';
import * as ExtensionElementHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';
import { BpmnProperty } from '../BpmnDataModel';

@Injectable()
export class BpmnExtensionElementService {

    bpmnElement: any;
    bpmnModeler: any;

    constructor() { }

    setup(bpmnModeler: any, bpmnElement: any) {
        this.bpmnModeler = bpmnModeler;
        this.bpmnElement = bpmnElement;
    }

    changeBpmnElement(bpmnElement: any): void {
        this.bpmnElement = bpmnElement;
    }

    getExtensionElements(){
        this.bpmnElement.businessObject.extensionElements;
    }

    getInputParameters(): CamundaInputParameter[] {
        return InputOutputHelper.getInputParameters(this.bpmnElement) as CamundaInputParameter[];
    }

    /**
     * Adds an input parameter to the current bpmn element
     * @param value Value to be set as input parameter
     */
    addCamundaInputParameter(prop: BpmnProperty): void {
        const stringVal = JSON.stringify(prop.value);

        // TODO: Check if there are already input parameters. If so, don't create new ones
        const moddle = this.bpmnModeler.get("moddle");

        let existingInputParameters;
        let inputParameter;
        let inputOutput;
        // If this input parameter exists, set the new value
        try {
            existingInputParameters = this.getInputParameters();
            inputParameter = existingInputParameters.find(input => input.name == prop.key);

            inputParameter.value = JSON.stringify(prop.value);
            inputOutput = moddle.create('camunda:InputOutput', {
                inputParameters: [...existingInputParameters]
            });
        } catch (error) {
            // In case it doesn't exist, create a new one
            inputParameter = moddle.create('camunda:InputParameter', {
                name: `${prop.key}`,
                value: `${stringVal}`
            });
            inputOutput = moddle.create('camunda:InputOutput', {
                inputParameters: [...existingInputParameters, inputParameter]
            });
        }

        const extensionElements = moddle.create('bpmn:ExtensionElements', {
            values: [inputOutput]
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
