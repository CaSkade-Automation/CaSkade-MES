import { FormGroup } from '@angular/forms';
import { BaseProperty, ReadonlyProperty } from '../Property';

export class PropertyBuilder {


    constructor() { }

    toFormGroup(propertyGroups: BpmnPropertyGroup[]): FormGroup {
        const group: any = {};

        propertyGroups.forEach(propertyGroup => {
            group[propertyGroup.propertyKey] = new FormGroup({});
        });
        return new FormGroup(group);
    }

    /**
     * Creates properties that shall be present for every element
     * @param bpmnElement BPMN element to create properties for
     */
    protected createBasePropertyGroups(bpmnElement): BpmnPropertyGroup[] {
        const idProperty = new ReadonlyProperty(
            {
                key: "id",
                label: "Unique ID that identifies this element",
                order: 1,
                required: false,
                value: bpmnElement?.id
            }
        );
        const idPropertyGroup = new BpmnPropertyGroup("id", [idProperty]);

        const typeProperty = new ReadonlyProperty(
            {
                key: "type",
                label: "BPMN Type of this element",
                order: 2,
                required: false,
                value: bpmnElement?.type
            }
        );
        const typePropertyGroup = new BpmnPropertyGroup("type", [typeProperty]);

        return [idPropertyGroup, typePropertyGroup];
    }


    /**
     * Creates specific properties depending on the BPMN element type
     * @param bpmnElement BPMN element to create properties for
     */
    createPropertyGroups(bpmnElement): BpmnPropertyGroup[] {
        return this.createBasePropertyGroups(bpmnElement);
    }

    /**
     * Transforms values to make them consistent with BPMN syntax
     * @param rawFormValues raw values that a user enters in the form
     */
    transformFormValues(rawFormValues) {
        // In this base PropertyController, there is no transforming needed, so just return rawFormValues
        return rawFormValues;
    }

}


/**
 * Acts as an abstraction layer between angular form properties and BPMN properties.
 * Some BPMN properties might consist of several form fields
 */
export class BpmnPropertyGroup {

    public props: Array<BaseProperty>;

    constructor(public propertyKey: string, public properties = []) { }

    addProperty(property: BaseProperty): void {
        this.props.push(property);
    }
}
