import { Injectable } from "@nestjs/common";
import { SkillExecutor } from "./SkillExecutor";
import { OpcUaSkillExecutionService } from "./OpcUaSkillExecutor";
import { RestSkillExecutionService } from "./RestSkillExecutor";
import { NullSkillExecutor } from "./NullSkillExecutor";
import { GraphDbConnectionService } from "../../util/GraphDbConnection.service";

@Injectable()
export class SkillExecutorFactory {

    constructor(private graphDbConnection: GraphDbConnectionService) {}

    /**
     * Factory method that returns a matching SkillExecutor for a skill
     * @param skillIri IRI of the skill to get the executor for
     */
    async getSkillExecutor(skillIri: string): Promise<SkillExecutor> {
        const skillType = await this.getSkillType(skillIri);

        switch (skillType) {
        case 'OpcUaSkill':
            return new OpcUaSkillExecutionService();
        case 'RestSkill':
            return new RestSkillExecutionService();
        default:
            return new NullSkillExecutor();
        }

    }

    /**
     * Get the skill type of a given skill
     * @param skillIri IRI of the skill to get the type of
     */
    private async getSkillType(skillIri: string): Promise<string> {
        const query = `
        PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
        PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
        SELECT ?skill ?skillType WHERE {
            ?skill a Cap:Skill.
            FILTER(?skillIri = IRI("${skillIri}"))
            ?skill a ?skillType.
            ?skillType sesame:directSubClassOf Cap:Skill.
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const skillType = queryResult.results.bindings["skillType"].value as string;
        return skillType;
    }

}
