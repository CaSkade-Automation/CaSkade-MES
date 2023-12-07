import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'production-modules', loadChildren: () => import('../modules/production-modules/production-module.module').then(m => m.ModuleManagementModule)},
            { path: 'process-planning', loadChildren: () => import('../modules/process-planning/process-planning.module').then(m => m.ProcessPlanningModule)},
            { path: 'skills', loadChildren: () => import('../modules/skills/skill-container.module').then(m => m.SkillContainerModule)},
            { path: 'capabilities', loadChildren: () => import('../modules/capabilities/capability.module').then(m => m.CapabilityModule)},
            { path: 'production-processes', loadChildren: () => import('../modules/production-processes/production-processes.module').then(m => m.ProductionProcessesModule)},
            { path: 'skillmex-configuration', loadChildren: () => import('../modules/skillmex-configuration/skillmex-configuration.module').then(m => m.SkillMexConfigurationModule)},
            { path: 'graph-visualization', loadChildren: () => import('../modules/graph-visualization/graph-visualization.module').then(m =>m.GraphVisualizationModule)},
            { path: 'dashboard', loadChildren: () => import('../modules/dashboard/dashboard.module').then(m => m.DashboardModule)},
            { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
