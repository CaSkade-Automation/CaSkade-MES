import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleManagementComponent } from './module-management.component';


const routes: Routes = [
  {
    path: '',
    component: ModuleManagementComponent,
    data: {
      title: 'ModuleManagement'
    },
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModuleManagementRouter { }
