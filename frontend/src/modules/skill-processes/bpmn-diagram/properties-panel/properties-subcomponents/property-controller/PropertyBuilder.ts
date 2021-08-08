import { FormGroup } from '@angular/forms';
import { BpmnPropertyGroup } from '../bpmn-property/bpmn-property-group';
import { ReadonlyInputProperty, TextInputProperty } from '../Property';

export class PropertyBuilder {

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
        const idProperty = new ReadonlyInputProperty(
            {
                key: "id",
                label: "Unique ID that identifies this element",
                order: 1,
                required: false,
                value: bpmnElement?.id
            }
        );
        const idPropertyGroup = new BpmnPropertyGroup("id", [idProperty]);

        const typeProperty = new ReadonlyInputProperty(
            {
                key: "type",
                label: "BPMN Type of this element",
                order: 2,
                required: false,
                value: bpmnElement?.type
            }
        );
        const typePropertyGroup = new BpmnPropertyGroup("type", [typeProperty]);

        const nameProperty = new TextInputProperty(
            {
                key: "name",
                label: "Name of this element",
                order: 3,
                required: false,
                value: bpmnElement?.businessObject.name
            }
        );
        const namePropertyGroup = new BpmnPropertyGroup("name", [nameProperty]);


        return [idPropertyGroup, typePropertyGroup, namePropertyGroup];
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
