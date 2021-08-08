import { PropertyBuilder } from "./PropertyBuilder";
import { SkillSelectionProperty, CommandTypeSelectionProperty, TextInputProperty, ReadonlyInputProperty } from "../Property";
import { SkillService } from "src/shared/services/skill.service";
import { BpmnPropertyGroup } from "../bpmn-property/bpmn-property-group";

export class SkillTaskPropertyBuilder extends PropertyBuilder {

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

        const delegateClassProperty = new ReadonlyInputProperty(
            {
                key: "camunda:class",
                label: "The Java delegate class that is in charge of executing this service task",
                order: 10,
                required: false,
                value: 'de.hsuhh.aut.skills.bpmn.delegates.MyJavaDelegate;',
                hidden: true
            }
        );
        const delegateClassPropertyGroup = new BpmnPropertyGroup("camunda:class", [delegateClassProperty]);


        // const parameterProperties = new parameterProperties();

        return [...basePropertyGroups, skillPropertyGroup, delegateClassPropertyGroup];
    }

}
