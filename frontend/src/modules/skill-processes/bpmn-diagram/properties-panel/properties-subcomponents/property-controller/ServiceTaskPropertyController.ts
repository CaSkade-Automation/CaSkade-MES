import { PropertyController } from "./PropertyController";
import { SkillSelectionProperty, CommandTypeSelectionProperty, BaseProperty } from "../Property";
import { SkillService } from "src/shared/services/skill.service";

export class ServiceTaskPropertyController extends PropertyController {

    constructor(private skillService: SkillService) {
        super();
    }

    createPropertyGroups(bpmnElement: any): BaseProperty[] {
        const baseProperties = this.createBaseProperties(bpmnElement);
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



        // const parameterProperties = new parameterProperties();

        return [...baseProperties, skillProperty, commandTypeProperty];
    }

    transformFormValues(rawFormValues) {
        // TODO
    }

}
