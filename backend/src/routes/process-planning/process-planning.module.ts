import { Module } from "@nestjs/common";
import { ProcessPlanningController } from "./process-planning.controller";
import { ProcessPlanningService } from "./process-planning.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
    HttpModule
    ],
    controllers: [ProcessPlanningController],
    providers: [ProcessPlanningService],
    exports: [],
    })
export class ProcessPlanningModule {}
