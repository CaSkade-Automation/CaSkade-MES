import { PropertyBuilder } from "./PropertyBuilder";
import { CheckboxProperty, TextInputProperty } from "../Property";
import { BpmnPropertyGroup } from "../bpmn-property/bpmn-property-group";
import { FormGroup } from "@angular/forms";

export class HumanTaskPropertyBuilder extends PropertyBuilder {

    createPropertyGroups(bpmnElement: any, form?: FormGroup): BpmnPropertyGroup[] {
        // create merged object because properties are spread across different objects
        const businessObject = bpmnElement.businessObject;
        const otherAttrs = businessObject.$attrs;
        const properties = {...bpmnElement,...businessObject, ...otherAttrs};

        const baseProperties = this.createBasePropertyGroups(bpmnElement);

        const assigneeProperty = new TextInputProperty({
            key: "Assignee",
            label: "Person that will be responsible to complete this task",
            order: 4,
            required: true,
            value: properties["camunda:assignee"]
        });
        const assigneePropertyGroup = new BpmnPropertyGroup("camunda:assignee", [assigneeProperty]);

        return [...baseProperties,  assigneePropertyGroup];
    }

    transformFormValues(rawFormValues) {
        return rawFormValues.condition = "${" + rawFormValues.condition +"}";
    }

}
