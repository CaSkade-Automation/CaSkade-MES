import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapabilityComponent } from './capability.component';
import { CapabilityRoutes } from './capability.routing';
import { CapabilityOverviewComponent } from './capability-overview/capability-overview.component';
import { CapabilityGraphVisuComponent } from './capability-graph-visu/capability-graph-visu.component';
import { CapabilityRegistrationComponent } from './capability-registration/capability-registration.component';
import { SkillCardModule } from 'src/shared/modules/skill-card/skill-card.module';
import { OntologyRegistrationModule } from 'src/shared/modules/ontology-registration/ontology-registration.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapabilityCardModule } from '../../shared/modules/capability-card/capability-card.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CapabilityRoutes,
        CapabilityCardModule,
        SkillCardModule,
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
