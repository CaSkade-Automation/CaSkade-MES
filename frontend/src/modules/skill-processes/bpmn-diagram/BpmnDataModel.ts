
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
        this.bpmnDataModel.updateProperties(bpmnElement, {[property.key]: property.value});
    }

}

export class BpmnProperty {

    constructor(public key: string, public value: string|number|{}) {}
}
