import { Routes, RouterModule } from '@angular/router';
import { ProductionProcessesComponent } from './production-processes.component';

const routes: Routes = [
    { path: 'model', component: ProductionProcessesComponent},
    { path: 'control', loadChildren: () => import('./process-control/process-control.module').then(m => m.ProcessControlModule)},
];

export const SkillProcessesRoutingModule = RouterModule.forChild(routes);
