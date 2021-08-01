import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseProperty, ReadonlyProperty } from '../Property';

export class PropertyController {


    constructor() {}

    toFormGroup(properties: BaseProperty[] ): FormGroup {
        const group: any = {};

        properties.forEach(property => {
            // new FormControl({value: null, disabled: true}, Validators.required),
            if (property.required && property.readonly) {
                group[property.key] = new FormControl({value: property.value || '', disabled: true}, Validators.required);
            }
            else if (property.required && !property.readonly) {
                group[property.key] = new FormControl({value: property.value || '', disabled: false}, Validators.required);
            }
            else if (!property.required && property.readonly) {
                group[property.key] = new FormControl({value: property.value || '', disabled: true});
            }
            else if (!property.required && !property.readonly) {
                group[property.key] = new FormControl({value: property.value || '', disabled: false});
            }
        });
        return new FormGroup(group);
    }

    /**
     * Creates properties that shall be present for every element
     * @param bpmnElement BPMN element to create properties for
     */
    protected createBaseProperties(bpmnElement): BaseProperty[] {
        const idProperty = new ReadonlyProperty(
            {
                key: "id",
                label: "Unique ID that identifies this element",
                order: 1,
                required: false,
                value: bpmnElement?.id
            }
        );

        const typeProperty = new ReadonlyProperty(
            {
                key: "type",
                label: "BPMN Type of this element",
                order: 2,
                required: false,
                value: bpmnElement?.type
            }
        );
        return [idProperty, typeProperty];
    }


    /**
     * Creates specific properties depending on the BPMN element type
     * @param bpmnElement BPMN element to create properties for
     */
    createPropertyGroups(bpmnElement): BaseProperty[] {
        return this.createBaseProperties(bpmnElement);
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
export class BpmnPropertyGroup<T> {

    public props: Array<BaseProperty>;

    constructor(public propertyKey: string, public properties = []) {}

    addProperty(property: BaseProperty): void {
        this.props.push(property);
    }
}
