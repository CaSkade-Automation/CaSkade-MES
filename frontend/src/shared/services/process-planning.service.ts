import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { PlanningResultDto } from '@shared/models/process-planning/PlanningResult';
import { PlanningDataDto } from '@shared/models/process-planning/PlanningDataDto';

@Injectable({
    providedIn: 'root'
})
export class ProcessPlanningService {

    private baseApiRoute = '/api/process-planning';
    private _currentPlan: PlanningResultDto;

    constructor(
        private httpClient: HttpClient
    ) { }


    isConnected(): Observable<HttpResponse<any>> {
        const pingUrl = `${this.baseApiRoute}/ping`;
        return this.httpClient.get<any>(pingUrl, { observe: 'response' }).pipe(take(1), tap(val => console.log(val)));
    }

    set currentResult(plan: PlanningResultDto) {
        this._currentPlan = plan;
    }

    get currentResult(): PlanningResultDto {
        return this._currentPlan;
    }


    /**
	 * Start a new process planning request
	 * @param plcFile MTP file that will be mapped
	 * @returns The mapped module with skills in turtle syntax
	 */
    createProcessPlan(planningData: PlanningDataDto): Observable<PlanningResultDto> {
        return this.httpClient.post(this.baseApiRoute, planningData) as Observable<PlanningResultDto>;
    }
}
