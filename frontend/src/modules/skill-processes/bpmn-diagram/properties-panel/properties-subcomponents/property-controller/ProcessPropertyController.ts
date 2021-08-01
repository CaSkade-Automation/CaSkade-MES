import { PropertyController } from "./PropertyController";
import { BaseProperty, StringInputProperty } from "../Property";

export class ProcessPropertyController extends PropertyController {

    createPropertyGroups(bpmnElement: any): BaseProperty[] {
        const baseProperties = this.createBaseProperties(bpmnElement);
        const processNameProperty = new StringInputProperty(
            {
                key: "name",
                label: "Process Name",
                order: 3,
                required: true,
                value: bpmnElement.name
            });

        return [...baseProperties, processNameProperty];
    }

    transformFormValues(rawFormValues) {
        return rawFormValues.condition = "${" + rawFormValues.condition +"}";
    }

}
