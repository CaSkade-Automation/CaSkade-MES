import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { StatModule } from '../../shared';
import { NotificationComponent } from './components/notification/notification.component';
import { ChartsModule } from '../../layout/charts/charts.module';
import { SettingsOverviewComponent } from './components/settings-overview/settings-overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DashboardRoutingModule,
        StatModule,
        ChartsModule
    ],
    declarations: [
        DashboardComponent,
        NotificationComponent,
        SettingsOverviewComponent
    ]
})
export class DashboardModule {}
