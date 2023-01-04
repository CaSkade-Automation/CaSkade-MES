import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { StatModule } from '../../shared';
import { NotificationComponent } from './components/notification/notification.component';
import { ChartsModule } from '../../layout/charts/charts.module';
import { ControlOverviewComponent } from './components/control-overview/control-overview.component';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        StatModule,
        ChartsModule
    ],
    declarations: [
        DashboardComponent,
        NotificationComponent,
        ControlOverviewComponent
    ]
})
export class DashboardModule {}
