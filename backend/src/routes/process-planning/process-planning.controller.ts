import { Controller, Get, Post, ServiceUnavailableException } from "@nestjs/common";
import { Observable, catchError } from "rxjs";
import { ProcessPlanningService } from "./process-planning.service";
import { PlanningResultDto } from "@shared/models/process-planning/PlanningResult";

@Controller('/process-planning')
export class ProcessPlanningController {

    constructor(
        private planningService: ProcessPlanningService
    ) {}

    @Get('ping')
    pingPlanningApi(): Observable<void> {
        return this.planningService.ping().pipe(
            catchError(err => {
                throw new ServiceUnavailableException(null, "Service is not running. Make sure to start the Planning REST API.");
            })
        );
    }


    @Post('')
    createProcessPlan(): Observable<PlanningResultDto> {
        return this.planningService.createProcessPlan().pipe(
            catchError(err => {
                throw new ServiceUnavailableException(null, "Service is not running. Make sure to start the Planning REST API.");
            })
        );
    }

}
