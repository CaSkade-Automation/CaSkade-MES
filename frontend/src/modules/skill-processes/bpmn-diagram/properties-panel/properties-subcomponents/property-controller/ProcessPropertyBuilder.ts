import { BpmnPropertyGroup, PropertyBuilder } from "./PropertyBuilder";
import { StringInputProperty } from "../Property";

export class ProcessPropertyBuilder extends PropertyBuilder {

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
