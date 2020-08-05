import { Routes, RouterModule } from '@angular/router';
import { SkillProcessesComponent } from './skill-processes.component';

const routes: Routes = [
    { path:'', component: SkillProcessesComponent},
];

export const SkillProcessesRoutes = RouterModule.forChild(routes);
