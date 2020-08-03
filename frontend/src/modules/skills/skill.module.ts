import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillComponent } from './skill.component';
import { SkillRoutes } from './skill.routing';
import { CommandFeatureModule } from 'src/shared/command-feature/command-feature.module';
import { SkillOverviewComponent } from './skill-overview/skill-overview.component';
import { SkillGraphVisuComponent } from './skill-graph-visu/skill-graph-visu.component';
import { SkillRegistrationComponent } from './skill-registration/skill-registration.component';
import { ManualRegistrationModule } from 'src/shared/modules/manual-registration/manual-registration.module';



@NgModule({
    imports: [
        SkillRoutes,
        CommonModule,
        CommandFeatureModule,
        ManualRegistrationModule

    ],
    declarations: [
        SkillComponent,
        SkillOverviewComponent,
        SkillGraphVisuComponent,
        SkillRegistrationComponent
    ]
})
export class SkillModule { }
