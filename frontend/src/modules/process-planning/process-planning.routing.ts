import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewOrderComponent } from './new-plan/new-plan.component';
import { ProcessPlanningComponent } from './process-planning.component';
import { UploadSummaryComponent } from './check-plan/check-plan.component';
import { BpmnPlanningResultComponent } from './bpmn-result/bpmn-result.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'new-plan',
        pathMatch: 'full',
    },
    {
        path: '',
        component: ProcessPlanningComponent,
        data: {
            title: 'OrderManagement'
        },
        children: [
            {
                path: 'new-plan',
                component: NewOrderComponent,
                data: {
                    title: 'New Order'
                }
            },
            {
                path: 'check-plan',
                component: UploadSummaryComponent,
                data: {
                    title: 'Order Summary'
                }
            },
            {
                path: 'bpmn-result',
                component: BpmnPlanningResultComponent,
                data: {
                    title: 'Check-Result'
                }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcessPlanningRouter { }
