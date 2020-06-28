import { Routes, RouterModule } from '@angular/router';
import { CapabilityOverviewComponent } from './capability-overview.component';

const routes: Routes = [
    {path:'', component: CapabilityOverviewComponent }
   
];

export const CapabilityOverviewRoutes = RouterModule.forChild(routes);
