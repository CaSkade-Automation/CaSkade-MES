import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { PlanningResultDto } from '@shared/models/process-planning/PlanningResult';
import { GraphDbConnectionService } from "../../util/GraphDbConnection.service";

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


    createProcessPlan(): Observable<PlanningResultDto> {
        const planningUrl = `${this.config.url}/plan`;

        const params = {
            "mode": 'sparql-endpoint',
            "endpoint-url": this.graphDbConnection.getCurrentRepoEndpointString()
        };

        return this.http.post<PlanningResultDto>(planningUrl, null , {params: params}).pipe(map(res => res.data));
    }


}
