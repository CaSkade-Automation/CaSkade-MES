import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionModuleComponent } from './production-module.component';
import { ModuleOverviewComponent } from './module-overview/module-overview.component';
import { ModuleGraphVisuComponent } from './module-graph-visu/module-graph-visu.component';
import { ModuleRegistrationComponent } from './module-registration/module-registration.component';


const routes: Routes = [
    {
        path: '',
        component: ProductionModuleComponent,
        data: {
            title: 'ModuleManagement'
        },
        children: [
            {path: '', redirectTo: 'overview', pathMatch: 'full'},
            {path: 'overview', component: ModuleOverviewComponent},
            // {path: 'graph-visualization', component: ModuleGraphVisuComponent},  // Note that graph visu is passed to the graph visu module
            {path: 'register', component: ModuleRegistrationComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModuleManagementRouter { }

