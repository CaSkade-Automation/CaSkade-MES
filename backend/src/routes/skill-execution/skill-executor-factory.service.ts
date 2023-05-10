import { Injectable } from "@nestjs/common";
import { SkillExecutor } from "./executors/SkillExecutor";
import { OpcUaMethodSkillExecutionService } from "./executors/opc-ua-executors/OpcUaMethodSkillExecutor";
import { RestSkillExecutionService } from "./executors/RestSkillExecutor";
import { NullSkillExecutor } from "./executors/NullSkillExecutor";
import { GraphDbConnectionService } from "../../util/GraphDbConnection.service";
import { SkillService } from "../skills/skill.service";
import { OpcUaVariableSkillExecutionService } from "./executors/opc-ua-executors/OpcUaVariableSkillExecutor";
import { OpcUaSessionManager } from "../../util/OpcUaSessionManager";
import { OpcUaStateTrackerManager } from "../../util/opcua-statetracker-manager.service";

@Injectable()
export class SkillExecutorFactory {

    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private skillService: SkillService,
        private uaSessionManager: OpcUaSessionManager,
        private uaStateTrackerManager: OpcUaStateTrackerManager
    ) {}

    /**
     * Factory method that returns a matching SkillExecutor for a skill
     * @param skillIri IRI of the skill to get the executor for
     */
    async getSkillExecutor(skillIri: string): Promise<SkillExecutor> {

        const skillInterfaceTypeIri = await this.skillService.getSkillInterfaceType(skillIri);

        switch (skillInterfaceTypeIri) {
        case 'http://www.w3id.org/hsu-aut/caskman#OpcUaMethodSkillInterface': {
            const methodSkillExecutor = new OpcUaMethodSkillExecutionService(
                this.graphDbConnection,
                this.uaSessionManager,
                this.skillService
            );
            return methodSkillExecutor;
        }
        case 'http://www.w3id.org/hsu-aut/caskman#OpcUaVariableSkillInterface': {
            const variableSkillExecutor = new OpcUaVariableSkillExecutionService(
                this.graphDbConnection,
                this.skillService,
                this.uaSessionManager,
                this.uaStateTrackerManager
            );
            return variableSkillExecutor;
        }
        case 'http://www.w3id.org/hsu-aut/caskman#RestSkillInterface':
            return new RestSkillExecutionService(this.graphDbConnection);
        default:
            console.log(`Returning a default SkillExecutor. The given skill type ${skillInterfaceTypeIri} is not defined`);
            return new NullSkillExecutor();
        }

    }

}
