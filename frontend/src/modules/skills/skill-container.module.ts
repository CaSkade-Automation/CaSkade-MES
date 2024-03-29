import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillContainerComponent } from './skill-container.component';
import { SkillRoutes } from './skill-container.routing';
import { SkillCardModule } from 'src/shared/modules/skill-card/skill-card.module';
import { SkillGraphVisuComponent } from './skill-graph-visu/skill-graph-visu.component';
import { SkillRegistrationComponent } from './skill-registration/skill-registration.component';
import { OntologyRegistrationModule } from 'src/shared/modules/ontology-registration/ontology-registration.module';
import { SkillOverviewComponent } from './skill-overview/skill-overview.component';



@NgModule({
    imports: [
        SkillRoutes,
        CommonModule,
        SkillCardModule,
        OntologyRegistrationModule
    ],
    declarations: [
        SkillOverviewComponent,
        SkillContainerComponent,
        SkillGraphVisuComponent,
        SkillRegistrationComponent
    ]
})
export class SkillContainerModule { }
