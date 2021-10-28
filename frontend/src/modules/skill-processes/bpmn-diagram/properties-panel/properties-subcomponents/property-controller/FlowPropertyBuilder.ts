import { PropertyBuilder } from "./PropertyBuilder";
import { TextInputProperty } from "../Property";
import { BpmnPropertyGroup } from "../bpmn-property/bpmn-property-group";

export class FlowPropertyBuilder extends PropertyBuilder {

    createPropertyGroups(bpmnElement: any): BpmnPropertyGroup[] {
        const basePropertyGroups = this.createBasePropertyGroups(bpmnElement);
        const conditionProperty = new TextInputProperty(
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

}
