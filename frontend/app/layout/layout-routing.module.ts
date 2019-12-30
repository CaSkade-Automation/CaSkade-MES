import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'module-management', loadChildren: '../own-modules/module-management/module-management.module#ModuleManagementModule'},
            { path: 'order-management', loadChildren: '../own-modules/order-management/order-management.module#OrderManagementModule'},
            { path: 'kpi-dashboard', loadChildren: '../own-modules/kpi-dashboard/kpi-dashboard.module#KpiDashboardModule'},
            { path: 'reconfiguration-overview', loadChildren: '../own-modules/reconfiguration-overview/reconfiguration-overview.module#ReconfigurationOverviewModule'},
            { path: 'ops-configuration', loadChildren: '../own-modules/ops-configuration/ops-configuration.module#OpsConfigurationModule'},
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            {path:'graph-visualization', loadChildren: '../own-modules/graph-visualization/graph-visualization.module#GraphVisualizationModule'},
            { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
