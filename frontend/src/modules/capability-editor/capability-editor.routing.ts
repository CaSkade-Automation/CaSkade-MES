import { Routes, RouterModule } from '@angular/router';
import { CapabilityEditorComponent } from './capability-editor.component';

const routes: Routes = [
    { path:'', component: CapabilityEditorComponent, pathMatch: 'full'},
    { path:':capability-iri', component: CapabilityEditorComponent} ,
    // children: [
    //     {path: '', redirectTo: 'overview', pathMatch: 'full'},
    //     {path: 'overview', component: CapabilityOverviewComponent},
    //     {path: 'graph-visualization', component: CapabilityGraphVisuComponent},
    //     {path: 'register', component: CapabilityRegistrationComponent},
    // ]

];

export const CapabilityEditorRouting = RouterModule.forChild(routes);
