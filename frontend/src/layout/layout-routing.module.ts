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
            { path: 'order-management', loadChildren: () => import('../modules/order-management/order-management.module').then(m => m.OrderManagementModule)},
            { path: 'skills', loadChildren: () => import('../modules/skills/skill-container.module').then(m => m.SkillContainerModule)},
            { path: 'capabilities', loadChildren: () => import('../modules/capabilities/capability.module').then(m => m.CapabilityModule)},
            { path: 'skill-processes', loadChildren: () => import('../modules/skill-processes/skill-processes.module').then(m => m.SkillProcessesModule)},
            { path: 'kpi-dashboard', loadChildren: () => import('../modules/kpi-dashboard/kpi-dashboard.module').then(m => m.KpiDashboardModule)},
            { path: 'reconfiguration-overview', loadChildren: () => import('../modules/reconfiguration-overview/reconfiguration-overview.module').then(m => m.ReconfigurationOverviewModule)},
            { path: 'ops-configuration', loadChildren: () => import('../modules/ops-configuration/ops-configuration.module').then(m => m.OpsConfigurationModule)},
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
            { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)},
            { path: 'blank-page', loadChildren: () => import('./blank-page/blank-page.module').then(m => m.BlankPageModule)},

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
