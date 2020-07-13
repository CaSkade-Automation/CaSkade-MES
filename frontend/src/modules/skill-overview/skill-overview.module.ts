import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillOverviewComponent } from './skill-overview.component';
import { SkillOverviewRoutes } from './skill-overview.routing';
import { CommandFeatureComponent } from 'src/shared/command-feature/command-feature.component';


@NgModule({
    imports: [
        SkillOverviewRoutes,
        CommonModule
    ],
    declarations: [SkillOverviewComponent, CommandFeatureComponent]
})
export class SkillOverviewModule { }
