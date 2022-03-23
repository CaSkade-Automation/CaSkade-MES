import { Injectable } from '@angular/core';
import * as InputOutputHelper from 'bpmn-js-properties-panel/lib/helper/InputOutputHelper';
import { BpmnDataModel, BpmnProperty } from '../BpmnDataModel';

@Injectable()
export class BpmnExtensionElementService {

    bpmnElement: any;
    bpmnModeler: any;
    dataModel: BpmnDataModel;
    moddle: any;

    setup(bpmnModeler: any, bpmnElement: any) {
        this.bpmnModeler = bpmnModeler;
        this.bpmnElement = bpmnElement;
        this.dataModel = new BpmnDataModel(this.bpmnModeler.get("modeling"));
        this.moddle = this.bpmnModeler.get("moddle");
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

    getOutputParameters(): CamundaOutputParameter[] {
        return InputOutputHelper.getOutputParameters(this.bpmnElement) as CamundaInputParameter[];
    }

    /**
     * Updates a simple bpmn property (e.g. name, user task assignee)
     * @param property
     */
    updateBaseProperty(property: BpmnProperty): void {
        this.dataModel.updateProperty(this.bpmnElement, property);
    }

    /**
     * Adds an input parameter to the current bpmn element
     * @param value Value to be set as input parameter
     */
    addCamundaInputParameter(prop: BpmnProperty): void {
        const stringVal = JSON.stringify(prop.value);

        const existingInputParameters = this.getInputParameters();
        const existingOutputParameters = this.getOutputParameters();

        try {
            // If this input parameter exists, set the new value
            const inputParameter = existingInputParameters.find(input => input.name == prop.key);

            inputParameter.value = JSON.stringify(prop.value);
            this.updateInputOutput(existingInputParameters, existingOutputParameters);
        } catch (error) {
            // In case it doesn't exist, create a new one
            const inputParameter = this.moddle.create('camunda:InputParameter', {
                name: `${prop.key}`,
                value: `${stringVal}`
            });
            const inputParameters = [...existingInputParameters, inputParameter];

            this.updateInputOutput(inputParameters, existingOutputParameters);
        }
    }

    setCamundaOutputParameters(props: Array<BpmnProperty>): void {
        // Get existing parameters to not overwrite them
        const existingInputParameters = this.getInputParameters();
        const outputParameters = new Array<CamundaOutputParameter>();
        // Create new output (note that ${name} has to be set as value so that the value is passed in by the engine)
        props.forEach(prop => {
            const newOutputParameter = this.moddle.create('camunda:OutputParameter', {
                name: `${prop.key}`,
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

        const extensionElements = this.moddle.create('bpmn:ExtensionElements', {
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
