import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: 'check-plan',
    templateUrl: 'check-plan.component.html',
})
export class UploadSummaryComponent {

    plan = "";

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {}


    nextTab(): void {
        this.router.navigate(['../producibility-check'], {relativeTo: this.route});
    }


}
