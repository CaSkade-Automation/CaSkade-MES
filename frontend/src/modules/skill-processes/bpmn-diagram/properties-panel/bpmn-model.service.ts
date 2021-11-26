import { Injectable } from '@angular/core';
import * as InputOutputHelper from 'bpmn-js-properties-panel/lib/helper/InputOutputHelper';
import { CamundaOutputParameter } from './bpmn-extension-element.service';

@Injectable()
export class BpmnModelService {

    bpmnModel: any;
    elementRegistry: any;

    constructor() { }

    setup(bpmnModel: any) {
        this.bpmnModel = bpmnModel;
        this.elementRegistry = this.bpmnModel.get("elementRegistry");
    }


    getAllOutputs(): Array<CamundaOutputParameter> {
        const tasks = this.elementRegistry.filter(elem => elem.type === "bpmn:ServiceTask");
        const outputs = new Array<CamundaOutputParameter>();

        tasks.forEach(task => {
            const output = InputOutputHelper.getOutputParameters(task);
            outputs.push(...output);
        });

        return outputs;
    }
}
