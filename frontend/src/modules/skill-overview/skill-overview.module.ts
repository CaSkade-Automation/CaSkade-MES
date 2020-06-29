import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillOverviewComponent } from './skill-overview.component';
import { SkillOverviewRoutes } from './skill-overview.routing';

@NgModule({
    imports: [
        SkillOverviewRoutes,
        CommonModule
    ],
    declarations: [SkillOverviewComponent]
})
export class SkillOverviewModule { }
