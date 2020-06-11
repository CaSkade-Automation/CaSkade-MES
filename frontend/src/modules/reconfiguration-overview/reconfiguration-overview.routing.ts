import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReconfigurationOverviewComponent } from './reconfiguration-overview.component';


const routes: Routes = [
  {
    path: '',
    component: ReconfigurationOverviewComponent,
    data: {
      title: 'Reconfiguration-Overview'
    },
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ReconfigurationOverviewRouter { }
