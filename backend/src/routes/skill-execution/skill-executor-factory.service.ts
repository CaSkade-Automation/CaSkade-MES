import { Injectable } from "@nestjs/common";
import { SkillExecutor } from "./executors/SkillExecutor";
import { OpcUaMethodSkillExecutionService } from "./executors/opc-ua-executors/OpcUaMethodSkillExecutor";
import { RestSkillExecutionService } from "./executors/RestSkillExecutor";
import { NullSkillExecutor } from "./executors/NullSkillExecutor";
import { GraphDbConnectionService } from "../../util/GraphDbConnection.service";
import { SkillService } from "../skills/skill.service";
import { OpcUaVariableSkillExecutionService } from "./executors/opc-ua-executors/OpcUaVariableSkillExecutor";

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

        const skillTypeIri = await this.skillService.getSkillType(skillIri);

        switch (skillTypeIri) {
        case 'http://www.hsu-ifa.de/ontologies/capability-model#OpcUaMethodSkill': {
            const methodSkillExecutor = new OpcUaMethodSkillExecutionService(this.graphDbConnection, this.skillService, skillIri);
            await methodSkillExecutor.connectAndCreateSession();
            return methodSkillExecutor;
        }
        case 'http://www.hsu-ifa.de/ontologies/capability-model#OpcUaVariableSkill': {
            const variableSkillExecutor = new OpcUaVariableSkillExecutionService(this.graphDbConnection, this.skillService, skillIri);
            await variableSkillExecutor.connectAndCreateSession();
            return variableSkillExecutor;
        }
        case 'http://www.hsu-ifa.de/ontologies/capability-model#RestSkill':
            return new RestSkillExecutionService(this.graphDbConnection);
        default:
            console.log(`Returning a default SkillExecutor. The given skill type ${skillTypeIri} is not defined`);
            return new NullSkillExecutor();
        }

    }

}
