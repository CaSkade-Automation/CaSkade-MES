import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BaseProperty, StringInputProperty, SkillSelectionProperty, CommandTypeSelectionProperty, ReadonlyProperty } from '../Property';
import { SkillService } from 'src/shared/services/skill.service';

export class PropertyController {

    toFormGroup(properties: BaseProperty<string>[] ): FormGroup {
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
    protected createBaseProperties(bpmnElement): BaseProperty<string>[] {
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
    createProperties(bpmnElement): BaseProperty<string>[] {
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
