import { PropertyController } from "./PropertyController";
import { BaseProperty, StringInputProperty } from "../Property";

export class FlowPropertyController extends PropertyController {

    createProperties(bpmnElement: any): BaseProperty<string>[] {
        const baseProperties = this.createBaseProperties(bpmnElement);
        const conditionProperty = new StringInputProperty(
            {
                key: "condition",
                label: "Condition that has to be true in order to follow this flow",
                order: 3,
                required: false,
                value: ''
            });

        return [...baseProperties, conditionProperty];
    }

    transformFormValues(rawFormValues) {
        return rawFormValues.condition = "${" + rawFormValues.condition +"}";
    }

}
