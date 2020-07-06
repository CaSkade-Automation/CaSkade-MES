import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapabilityOverviewComponent } from './capability-overview.component';
import { CapabilityOverviewRoutes } from './capability-overview.routing';
import { CommandFeatureComponent } from 'src/shared/command-feature/command-feature.component';


@NgModule({
    imports: [
        CommonModule,
        CapabilityOverviewRoutes
    ],
    declarations: [CapabilityOverviewComponent,CommandFeatureComponent]
})
export class CapabilityOverviewModule { }
