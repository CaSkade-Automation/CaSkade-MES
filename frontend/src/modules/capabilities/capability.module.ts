import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapabilityComponent } from './capability.component';
import { CapabilityRoutes } from './capability.routing';
import { CapabilityOverviewComponent } from './capability-overview/capability-overview.component';
import { CapabilityGraphVisuComponent } from './capability-graph-visu/capability-graph-visu.component';
import { CapabilityRegistrationComponent } from './capability-registration/capability-registration.component';
import { CommandFeatureModule } from 'src/shared/command-feature/command-feature.module';

@NgModule({
    imports: [
        CommonModule,
        CapabilityRoutes,
        CommandFeatureModule
    ],
    declarations: [
        CapabilityComponent,
        CapabilityOverviewComponent,
        CapabilityGraphVisuComponent,
        CapabilityRegistrationComponent
    ]
})
export class CapabilityModule { }
