import { Routes, RouterModule } from '@angular/router';
import { SkillOverviewComponent } from './skill-overview.component';

const routes: Routes = [
    {path:'', component:SkillOverviewComponent  },
];

export const SkillOverviewRoutes = RouterModule.forChild(routes);
