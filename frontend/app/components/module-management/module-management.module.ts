// Angular
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Routing
import { ModuleManagementRouter } from './module-management.routing';
import { ModuleManagementComponent } from './module-management.component';
// Components


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ModuleManagementRouter,
  ],
  declarations: [
    ModuleManagementComponent,
  ]
})
export class ModuleManagementModule { }
