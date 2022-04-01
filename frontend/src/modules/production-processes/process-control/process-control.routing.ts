import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessControlComponent } from './process-control.component';
import { ProcessDefinitionsComponent } from './process-definitions/process-definitions.component';
import { ProcessInstancesComponent } from './process-instances/process-instances.component';

const routes: Routes = [
    {
        path: '',
        component: ProcessControlComponent,
        data: {
            title: 'ModuleManagement'
        },
        children: [
            {path: '', redirectTo: 'process-definitions', pathMatch: 'full'},
            {path: 'process-definitions', component: ProcessDefinitionsComponent},
            {path: 'process-instances', component: ProcessInstancesComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcessControlRoutingModule {}

