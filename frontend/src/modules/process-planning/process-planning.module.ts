// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';


// Routing
import { ProcessPlanningRouter } from './process-planning.routing';

// Components
import { NewOrderComponent } from './new-plan/new-plan.component';
import { ProcessPlanningComponent } from './process-planning.component';
import { UploadSummaryComponent } from './upload-summary/upload-summary.component';
import { CheckResultComponent } from './check-result/check-result.component';

@NgModule({
    imports: [
        ProcessPlanningRouter,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        HttpClientModule
    ],
    declarations: [
        ProcessPlanningComponent,
        NewOrderComponent,
        UploadSummaryComponent,
        CheckResultComponent,
    ],
    providers: [
    ]
})
export class ProcessPlanningModule { }
