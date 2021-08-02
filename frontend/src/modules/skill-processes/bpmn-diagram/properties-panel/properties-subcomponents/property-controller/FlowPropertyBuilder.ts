import { BpmnPropertyGroup, PropertyBuilder } from "./PropertyBuilder";
import { BaseProperty, StringInputProperty } from "../Property";

export class FlowPropertyBuilder extends PropertyBuilder {

    createPropertyGroups(bpmnElement: any): BpmnPropertyGroup[] {
        const basePropertyGroups = this.createBasePropertyGroups(bpmnElement);
        const conditionProperty = new StringInputProperty(
            {
                key: "condition",
                label: "Condition that has to be true in order to follow this flow",
                order: 3,
                required: false,
                value: ''
            });

        const conditionPropertyGroup = new BpmnPropertyGroup("condition", [conditionProperty]);

        return [...basePropertyGroups, conditionPropertyGroup];
    }

    transformFormValues(rawFormValues) {
        return rawFormValues.condition = "${" + rawFormValues.condition +"}";
    }

}
