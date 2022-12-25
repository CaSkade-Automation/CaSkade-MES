import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapabilityCardComponent } from './capability-card.component';
import { SkillCardModule } from '../skill-card/skill-card.module';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SkillCardModule,
    ],
    declarations: [CapabilityCardComponent],
    exports: [CapabilityCardComponent]
})
export class CapabilityCardModule { }
