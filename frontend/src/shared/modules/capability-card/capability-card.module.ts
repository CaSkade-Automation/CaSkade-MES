import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapabilityCardComponent } from './capability-card.component';
import { SkillCardModule } from '../skill-card/skill-card.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SkillCardModule,
    ],
    declarations: [CapabilityCardComponent],
    exports: [CapabilityCardComponent]
})
export class CapabilityCardModule { }
