import { FormGroup } from "@angular/forms";
import { BaseProperty } from "../Property";

/**
 * Acts as an abstraction layer between angular form properties and BPMN properties.
 * Some BPMN properties might consist of several form fields
 */
export class BpmnPropertyGroup {
    private formControl: FormGroup;

    constructor(public propertyKey: string, public properties = new Array<BaseProperty>()) { }


    linkForm(formControl: FormGroup) {
        this.formControl = formControl;
    }

    /**
     * Get the combined value of this property group
     * @returns
     */
    getValue(): string|number|boolean|{} {
        // Default implementation for a single property: Just get that one value
        return this.formControl.get(this.properties[0].key).value;
    }
}



export class BpmnSkillInfoPropertyGroup extends BpmnPropertyGroup {
    constructor(public propertyKey: string, public properties = new Array<BaseProperty>()) {
        super(propertyKey, properties);
    }

    /**
     * Get the combined value of this property group
     * @returns
     */
    getValue(): string|number|{} {
        // Combine the properties into a single object
        const value = this.properties.reduce((obj, prop) => {
            obj[prop.key] = prop.value;
            return obj;
        }, {});

        return value;
    }
}
