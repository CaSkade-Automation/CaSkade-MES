import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapabilityCardComponent } from './capability-card.component';

@NgModule({
    imports: [
        CommonModule,
        SkillCardModule,
    ],
    declarations: [CapabilityCardComponent]
})
export class CapabilityCardModule { }
