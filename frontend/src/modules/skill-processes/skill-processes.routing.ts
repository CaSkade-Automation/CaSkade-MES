import { Routes, RouterModule } from '@angular/router';
import { ProcessControlComponent } from './process-control/process-control.component';
import { SkillProcessesComponent } from './skill-processes.component';

const routes: Routes = [
    { path:'model', component: SkillProcessesComponent},
    { path:'control', component: ProcessControlComponent}
];

export const SkillProcessesRoutes = RouterModule.forChild(routes);
