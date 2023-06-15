
/**
 * A class that acts as an abstraction of the bpmn-js "modeling"
 */
export class BpmnDataModel {

    constructor(private bpmnDataModel: any) {}

    /**
     * Update a property of the BPMN data model
     * @param property Property to update
     */
    updateProperty(bpmnElement: any, property: BpmnProperty): void {
        this.bpmnDataModel.updateProperties(bpmnElement, {[property.name]: property.value});
    }


    getProperty(bpmnElement: any, propertyName: string): string {
        const propertyValue = bpmnElement.businessObject.get(propertyName);
        return propertyValue;
    }

}

export class BpmnProperty {

    constructor(public name: string, public value: string | number | boolean | {}) {}
}

export class BpmnElement {
    children: Array<any>;
    id: string;
    labels: Array<any>
    order: {level: number};
    type: string;           // TODO: Could be an enum of BPMN element types
    height: number;
    width: number;
    x: number;
    y: number;
    businessObject: any;
}
