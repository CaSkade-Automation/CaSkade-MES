import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ProcessPlanningService } from '../../../shared/services/process-planning.service';
import { PlanDto, PlanningResultType } from '@shared/models/process-planning/PlanningResult';

@Component({
    selector: 'check-plan',
    templateUrl: 'check-plan.component.html',
})
export class UploadSummaryComponent implements OnInit {

    plan: PlanDto;
    resultType: PlanningResultType
    unsatCore: Array<string>

    constructor(
        private planningService: ProcessPlanningService,
        private router: Router,
        private route: ActivatedRoute
    ) {}


    get isSat(): boolean {
        return this.resultType == PlanningResultType.SAT;
    }

    ngOnInit(): void {
        this.resultType = this.planningService.currentResult.resultType;
        this.plan = this.planningService.currentResult.plan;
        if (this.isSat) {
            this.unsatCore = null;
        } else {
            this.unsatCore = this.planningService.currentResult.unsatCore.map(elem => elem.replace(/\n/g, '<br>'));
        }
    }

    nextTab(): void {
        if(this.resultType == PlanningResultType.UNSAT) return;
        this.router.navigate(['../bpmn-result'], {relativeTo: this.route});
    }


}
