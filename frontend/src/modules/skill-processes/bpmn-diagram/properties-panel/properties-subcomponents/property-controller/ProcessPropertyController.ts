import { BpmnPropertyGroup, PropertyController } from "./PropertyController";
import { BaseProperty, StringInputProperty } from "../Property";

export class ProcessPropertyController extends PropertyController {

    createPropertyGroups(bpmnElement: any): BpmnPropertyGroup[] {
        const baseProperties = this.createBasePropertyGroups(bpmnElement);
        const nameProperty = new StringInputProperty(
            {
                key: "name",
                label: "Process Name",
                order: 3,
                required: true,
                value: bpmnElement.name
            });

        const namePropertyGroup = new BpmnPropertyGroup("name", [nameProperty]);

        return [...baseProperties, namePropertyGroup];
    }

    transformFormValues(rawFormValues) {
        return rawFormValues.condition = "${" + rawFormValues.condition +"}";
    }

}
