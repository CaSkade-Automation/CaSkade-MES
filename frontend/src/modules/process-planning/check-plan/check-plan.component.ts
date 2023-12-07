import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ProcessPlanningService } from '../../../shared/services/process-planning.service';
import { PlanningResultDto } from '../../../../../shared/src/models/process-planning/PlanningResult';

@Component({
    selector: 'check-plan',
    templateUrl: 'check-plan.component.html',
})
export class UploadSummaryComponent implements OnInit {

    plan: PlanningResultDto;

    constructor(
        private planningService: ProcessPlanningService,
        private router: Router,
        private route: ActivatedRoute
    ) {}


    ngOnInit(): void {
        this.plan = this.planningService.currentPlan;
    }

    nextTab(): void {
        this.router.navigate(['../producibility-check'], {relativeTo: this.route});
    }


}
