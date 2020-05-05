import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KpiDashboardComponent } from './kpi-dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: KpiDashboardComponent,
    data: {
      title: 'KPI Dashboard'
    },
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class KpiDashboardRouter { }
