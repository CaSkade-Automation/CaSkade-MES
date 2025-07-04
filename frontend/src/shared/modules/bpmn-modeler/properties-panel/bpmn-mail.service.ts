import { Injectable } from '@angular/core';
import { BpmnDataModel } from '../BpmnDataModel';
import * as ExtensionElementHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

export enum CamundaMailConnectorFunction {
	"mail-send",
	"mail-poll",
	"mail-delete"
}

export class CamundaMailEntry {
	constructor(
		public to: string,
		public subject: string,
		public cc = "",
		public bcc = "",
		public text = "",
		public html = "",
		public filesNames = new Array<string>()
	) { }

    /**
     * Create a mail entry an existing entry in array form
     * @param camundaInputArray
     * @returns
     */
	static fromInputArray(camundaInputArray): CamundaMailEntry {
		const mailObj = {};
		camundaInputArray.forEach((input: any) => {
			mailObj[input.name] = input.value;
		})
        const mailEntry = new CamundaMailEntry(mailObj["to"], mailObj["subject"], mailObj["cc"], mailObj["bcc"], mailObj["text"], mailObj["html"], mailObj["fileNames"])
        return mailEntry
	}

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

	setup(bpmnModeler: any): void {
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

		const inputOutput = this.moddle.create('camunda:InputOutput', {
			inputParameters: inputParams,
		});

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

	getMailEntry(bpmnElement): CamundaMailEntry {
		const extensionElements = bpmnElement.businessObject.get("extensionElements");
		const connector = extensionElements.values.find(elem => elem.$type === "camunda:Connector");

		const mailInputParameters = connector.inputOutput.inputParameters as [];

		const mailEntry = CamundaMailEntry.fromInputArray(mailInputParameters);

        console.log("mail");

		console.log(mailEntry);

		console.log(ExtensionElementHelper.getExtensionElements(bpmnElement.businessObject, "camunda:Connector"));
		return null;
	}

}
