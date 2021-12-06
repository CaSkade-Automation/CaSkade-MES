import { Injectable } from '@angular/core';
import { BpmnDataModel } from '../BpmnDataModel';

export enum CamundaMailConnectorFunction {
    "mail-send",
    "mail-poll",
    "mail-delete"
}

export interface CamundaMailEntry {
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    text: string;
    html: string;
    filesNames: Array<string>;
}

/**
 * This service provides all relevant functions to handle elements related to camunda connectors
 * (e.g. mail send connector as shown in this example: https://github.com/camunda-community-hub/camunda-bpm-mail/tree/master/examples/pizza)
 */
@Injectable()
export class CamundaMailService {

    bpmnModeler: any;
    dataModel: BpmnDataModel;
    moddle: any;

    constructor() { }

    setup(bpmnModeler: any) {
        this.bpmnModeler = bpmnModeler;
        this.dataModel = new BpmnDataModel(this.bpmnModeler.get("modeling"));
        this.moddle = this.bpmnModeler.get("moddle");
    }

    addMailEntry(bpmnElement, connectorFunction: CamundaMailConnectorFunction, mailEntry: CamundaMailEntry): void {
        const inputParams = new Array<{}>();
        for (const key in mailEntry) {
            const inputParameter = this.moddle.create('camunda:InputParameter', {
                name: key,//`${asd}`,
                value: mailEntry[key]//`${prop.value}`
            });
            inputParams.push(inputParameter);
        }

        // const newInputParameter = this.moddle.create('camunda:InputParameter', {
        //     name: "qwe",//`${asd}`,
        //     value: "qweValue"//`${prop.value}`
        // });

        // const newOutputParameter = this.moddle.create('camunda:OutputParameter', {
        //     name: "asd",//`${asd}`,
        //     value: "asdValue"//`${prop.value}`
        // });

        console.log("inputParams");
        // console.log(inputParams);


        const inputOutput = this.moddle.create('camunda:InputOutput', {
            inputParameters: inputParams,
        });

        // const connectorId = this.moddle.create('camunda:ConnectorId', {
        //     value: "id"
        // });

        console.log("connectorFunction");
        console.log(connectorFunction);


        const connectorEntry = this.moddle.create('camunda:Connector', {
            inputOutput: inputOutput,
            connectorId: CamundaMailConnectorFunction[connectorFunction]
        });

        const extensionElements = this.moddle.create('bpmn:ExtensionElements', {
            values: [connectorEntry]
        });

        this.bpmnModeler.get("modeling").updateProperties(bpmnElement, {
            "extensionElements": extensionElements
        });
    }

}
