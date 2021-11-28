import { Injectable } from '@angular/core';
import { BpmnDataModel } from '../BpmnDataModel';

/**
 * This service provides all relevant functions to handle elements related to camunda connectors
 * (e.g. mail send connector as shown in this example: https://github.com/camunda-community-hub/camunda-bpm-mail/tree/master/examples/pizza)
 */
@Injectable()
export class CamundaConnectorService {

    bpmnModeler: any;
    bpmnElement: any;
    dataModel: BpmnDataModel;
    moddle: any;

    constructor() { }

    setup(bpmnModeler: any, bpmnElement: any) {
        this.bpmnModeler = bpmnModeler;
        this.bpmnElement = bpmnElement;
        this.dataModel = new BpmnDataModel(this.bpmnModeler.get("modeling"));
        this.moddle = this.bpmnModeler.get("moddle");
    }

    addConnectorEntry(): void {

        const newInputParameter = this.moddle.create('camunda:InputParameter', {
            name: "qwe",//`${asd}`,
            value: "qweValue"//`${prop.value}`
        });

        const newOutputParameter = this.moddle.create('camunda:OutputParameter', {
            name: "asd",//`${asd}`,
            value: "asdValue"//`${prop.value}`
        });

        const inputOutput = this.moddle.create('camunda:InputOutput', {
            inputParameters: [newInputParameter],
            outputParameters: [newOutputParameter]
        });

        // const connectorId = this.moddle.create('camunda:ConnectorId', {
        //     value: "id"
        // });

        const connectorEntry = this.moddle.create('camunda:Connector', {
            inputOutput: inputOutput,
            connectorId: "asd"
        });

        const extensionElements = this.moddle.create('bpmn:ExtensionElements', {
            values: [connectorEntry]
        });

        this.bpmnModeler.get("modeling").updateProperties(this.bpmnElement, {
            "extensionElements": extensionElements
        });
    }

}
