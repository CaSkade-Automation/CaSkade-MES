import { Routes, RouterModule } from '@angular/router';
import { ProcessControlComponent } from './process-control/process-control.component';
import { SkillProcessesComponent } from './skill-processes.component';

const routes: Routes = [
    { path: 'model', component: SkillProcessesComponent},
    { path: 'control', loadChildren: () => import('./process-control/process-control.module').then(m => m.ProcessControlModule)},
];

export const SkillProcessesRoutingModule = RouterModule.forChild(routes);
