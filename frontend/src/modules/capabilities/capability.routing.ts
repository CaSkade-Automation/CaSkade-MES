import { Routes, RouterModule } from '@angular/router';
import { CapabilityComponent } from './capability.component';
import { CapabilityOverviewComponent } from './capability-overview/capability-overview.component';
import { CapabilityGraphVisuComponent } from './capability-graph-visu/capability-graph-visu.component';
import { CapabilityRegistrationComponent } from './capability-registration/capability-registration.component';

const routes: Routes = [
    {
        path:'', component: CapabilityComponent ,
        children: [
            {path: '', redirectTo: 'overview', pathMatch: 'full'},
            {path: 'overview', component: CapabilityOverviewComponent},
            {path: 'graph-visualization', component: CapabilityGraphVisuComponent},
            {path: 'register', component: CapabilityRegistrationComponent},
        ]
    }

];

export const CapabilityRoutes = RouterModule.forChild(routes);
