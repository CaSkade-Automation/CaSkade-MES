import { Injectable } from "@nestjs/common";
import { SkillExecutor } from "./executors/SkillExecutor";
import { OpcUaSkillExecutionService } from "./executors/OpcUaSkillExecutor";
import { RestSkillExecutionService } from "./executors/RestSkillExecutor";
import { NullSkillExecutor } from "./executors/NullSkillExecutor";
import { GraphDbConnectionService } from "../../util/GraphDbConnection.service";
import { SkillService } from "../skills/skill.service";

@Injectable()
export class SkillExecutorFactory {

    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private skillService: SkillService) {}

    /**
     * Factory method that returns a matching SkillExecutor for a skill
     * @param skillIri IRI of the skill to get the executor for
     */
    async getSkillExecutor(skillIri: string): Promise<SkillExecutor> {

        const skillTypeIri = await this.getSkillType(skillIri);

        switch (skillTypeIri) {
        case 'http://www.hsu-ifa.de/ontologies/capability-model#OpcUaSkill':
            return new OpcUaSkillExecutionService(this.graphDbConnection, this.skillService);
        case 'http://www.hsu-ifa.de/ontologies/capability-model#RestSkill':
            return new RestSkillExecutionService(this.graphDbConnection);
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
            FILTER(?skill = IRI("${skillIri}"))
            ?skill a ?skillType.
            ?skillType sesame:directSubClassOf Cap:Skill.
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const skillTypeIri = queryResult.results.bindings[0]["skillType"].value;
        return skillTypeIri;
    }

}
