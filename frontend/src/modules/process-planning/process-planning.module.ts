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
import { UploadSummaryComponent } from './check-plan/check-plan.component';
import { BpmnPlanningResultComponent } from './bpmn-result/bpmn-result.component';

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
        BpmnPlanningResultComponent,
    ],
    providers: [
    ]
})
export class ProcessPlanningModule { }
