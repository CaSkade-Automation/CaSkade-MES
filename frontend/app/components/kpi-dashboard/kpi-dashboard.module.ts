// Angular
import { NgModule } from '@angular/core';

// Routing
import { KpiDashboardRouter } from './kpi-dashboard.routing';
import { KpiDashboardComponent } from './kpi-dashboard.component';
// Components


@NgModule({
  imports: [
    KpiDashboardRouter,
  ],
  declarations: [
    KpiDashboardComponent,
  ]
})
export class KpiDashboardModule { }
