import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapabilityComponent } from './capability.component';
import { CapabilityRoutes } from './capability.routing';
import { CapabilityOverviewComponent } from './capability-overview/capability-overview.component';
import { CapabilityGraphVisuComponent } from './capability-graph-visu/capability-graph-visu.component';
import { CapabilityRegistrationComponent } from './capability-registration/capability-registration.component';
import { SkillModule } from 'src/shared/modules/skill/skill.module';
import { OntologyRegistrationModule } from 'src/shared/modules/ontology-registration/ontology-registration.module';

@NgModule({
    imports: [
        CommonModule,
        CapabilityRoutes,
        SkillModule,
        OntologyRegistrationModule
    ],
    declarations: [
        CapabilityComponent,
        CapabilityOverviewComponent,
        CapabilityGraphVisuComponent,
        CapabilityRegistrationComponent
    ]
})
export class CapabilityModule { }
