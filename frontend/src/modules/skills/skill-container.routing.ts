import { Routes, RouterModule } from '@angular/router';
import { SkillContainerComponent } from './skill-container.component';
import { SkillRegistrationComponent } from './skill-registration/skill-registration.component';
import { SkillGraphVisuComponent } from './skill-graph-visu/skill-graph-visu.component';
import { SkillOverviewComponent } from './skill-overview/skill-overview.component';

const routes: Routes = [
    {path:'', component:SkillContainerComponent,
        children: [
            {path: '', redirectTo: 'overview', pathMatch: 'full'},
            {path: 'overview', component: SkillOverviewComponent},
            {path: 'graph-visualization', component: SkillGraphVisuComponent},
            {path: 'register', component: SkillRegistrationComponent},
        ] },
];

export const SkillRoutes = RouterModule.forChild(routes);
