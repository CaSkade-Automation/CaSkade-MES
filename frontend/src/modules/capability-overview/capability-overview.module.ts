import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapabilityOverviewComponent } from './capability-overview.component';
import { CapabilityOverviewRoutes } from './capability-overview.routing';

@NgModule({
    imports: [
        CommonModule,
        CapabilityOverviewRoutes
    ],
    declarations: [CapabilityOverviewComponent]
})
export class CapabilityOverviewModule { }
