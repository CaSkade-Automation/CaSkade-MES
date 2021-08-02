import { BpmnPropertyGroup, PropertyBuilder } from "./PropertyBuilder";
import { SkillSelectionProperty, CommandTypeSelectionProperty, BaseProperty } from "../Property";
import { SkillService } from "src/shared/services/skill.service";
import { BpmnPropertyComponent } from "../bpmn-property/bpmn-property.component";

export class ServiceTaskPropertyController extends PropertyBuilder {

    constructor(private skillService: SkillService) {
        super();
    }

    createPropertyGroups(bpmnElement: any): BpmnPropertyGroup[] {
        const basePropertyGroups = this.createBasePropertyGroups(bpmnElement);
        const skillProperty = new SkillSelectionProperty(
            {
                key: "skillIri",
                label: "The skill that should be executed in this task",
                order: 3,
                required: true,
                value: ''
            }, this.skillService
        );

        const commandTypeProperty = new CommandTypeSelectionProperty(
            {
                key: "commandTypeIri",
                label: "The command type of the skill that should be executed in this task",
                order: 4,
                required: true,
                value: ''
            }
        );

        // TODO: This has to be checked and properly set up. Adding Camunda extension elements is not that easys.
        const skillPropertyGroup = new BpmnPropertyGroup("skillIri", [skillProperty, commandTypeProperty]);



        // const parameterProperties = new parameterProperties();

        return [...basePropertyGroups, skillPropertyGroup];
    }

    transformFormValues(rawFormValues) {
        // TODO
    }

}
