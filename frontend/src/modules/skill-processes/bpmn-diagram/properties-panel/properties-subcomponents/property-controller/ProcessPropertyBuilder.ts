import { PropertyBuilder } from "./PropertyBuilder";
import { CheckboxProperty, TextInputProperty } from "../Property";
import { BpmnPropertyGroup } from "../bpmn-property/bpmn-property-group";

export class ProcessPropertyBuilder extends PropertyBuilder {

    createPropertyGroups(bpmnElement: any): BpmnPropertyGroup[] {
        // create merged object because properties are spread across different objects
        const businessObject = bpmnElement.businessObject;
        const otherAttrs = businessObject.$attrs;
        const properties = {...bpmnElement,...businessObject, ...otherAttrs};

        console.log(`setting up Property. Current Props`);
        console.log(properties);

        const baseProperties = this.createBasePropertyGroups(bpmnElement);
        const isExecutableProperty = new CheckboxProperty({
            key: "isExecutable",
            label: "Whether or not this process should be executable",
            order: 4,
            required: false,
            value: properties.isExecutable
        });
        const isExecutablePropertyGroup = new BpmnPropertyGroup("isExecutable", [isExecutableProperty]);

        const versionTagProperty = new TextInputProperty({
            key: "versionTag",
            label: "Version Tag of this process",
            order: 5,
            required: false,
            value: properties["camunda:versionTag"]
        });
        const versionTagPropertyGroup = new BpmnPropertyGroup("camunda:versionTag", [versionTagProperty]);

        return [...baseProperties, isExecutablePropertyGroup, versionTagPropertyGroup];
    }

    transformFormValues(rawFormValues) {
        return rawFormValues.condition = "${" + rawFormValues.condition +"}";
    }

}
