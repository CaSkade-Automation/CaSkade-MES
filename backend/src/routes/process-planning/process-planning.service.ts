import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { PlanningResultDto } from '@shared/models/process-planning/PlanningResult';
import { GraphDbConnectionService } from "../../util/GraphDbConnection.service";
import { PlanningDataDto } from "@shared/models/process-planning/PlanningDataDto";

/**
 * Currently just URL, but should be used for other config settings as well
 */
class PlanningServiceConfig {
    url: string
}

@Injectable()
export class ProcessPlanningService {

    private config: PlanningServiceConfig = {
        url: "http://localhost:5000"
    }

    constructor(
        private http: HttpService,
        private graphDbConnection: GraphDbConnectionService
    ) { }


    /**
     * Simple ping to see if the server is running
     * @returns Status code
     */
    ping(): Observable<void>{
        const pingUrl = `${this.config.url}/ping`;
        return this.http.get<void>(pingUrl).pipe(map(res => res.data));
    }


    createProcessPlan(planningData: PlanningDataDto): Observable<PlanningResultDto> {
        const planningUrl = `${this.config.url}/plan`;

        const planningRequestData = new PlanningRequestDto(
            "sparql-endpoint",
            this.graphDbConnection.getCurrentRepoEndpointString(),
            planningData.requiredCapabilityIri,
            planningData.maxHappenings
        );

        return this.http.post<PlanningResultDto>(planningUrl, planningRequestData).pipe(map(res => res.data));
    }


}


export class PlanningRequestDto {
    constructor(
		public mode: string,
		public endpointUrl: string,
		public requiredCapabilityIri: string,
        public maxHappenings: number,
    ) {}
}
