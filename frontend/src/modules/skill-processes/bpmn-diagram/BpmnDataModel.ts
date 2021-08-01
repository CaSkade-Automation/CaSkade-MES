
/**
 * A class that acts as an abstraction of the bpmn-js "modeling"
 */
export class BpmnDataModel {

    constructor(private bpmnDataModel: any) {}

    /**
     * Update a property of the BPMN data model
     * @param property Property to update
     */
    updateProperty<T>(bpmnElement: any, property: BpmnProperty<T>): void {
        this.bpmnDataModel.updateProperties(bpmnElement, property);
    }

}

export class BpmnProperty<T> {

    constructor(public key: string, public value: T) {}
}
