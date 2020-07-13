import { Routes, RouterModule } from '@angular/router';
import { SkillComponent } from './skill.component';
import { SkillOverviewComponent } from './skill-overview/skill-overview.component';
import { SkillRegistrationComponent } from './skill-registration/skill-registration.component';
import { SkillGraphVisuComponent } from './skill-graph-visu/skill-graph-visu.component';

const routes: Routes = [
    {path:'', component:SkillComponent,
        children: [
            {path: '', redirectTo: 'overview', pathMatch: 'full'},
            {path: 'overview', component: SkillOverviewComponent},
            {path: 'graph-visualization', component: SkillGraphVisuComponent},
            {path: 'register', component: SkillRegistrationComponent},
        ] },
];

export const SkillRoutes = RouterModule.forChild(routes);
