import { Module, forwardRef } from "@nestjs/common";
import { GraphDbConnectionModule } from "./GraphDbConnection.module";
import { SkillModule } from "../routes/skills/skill.module";
import { OpcUaSessionManager } from "./OpcUaSessionManager";
import { OpcUaStateTrackerManager } from "./opcua-statetracker-manager.service";
import { SkillStateModule } from "../routes/skill-states/skilll-state.modules";

@Module({
    imports:[
    GraphDbConnectionModule,
    SkillStateModule
    ],
    providers: [
    OpcUaStateTrackerManager,
    OpcUaSessionManager
    ],
    exports: [
    OpcUaStateTrackerManager,
    OpcUaSessionManager
    ],
    })
export class OpcUaModule {}
