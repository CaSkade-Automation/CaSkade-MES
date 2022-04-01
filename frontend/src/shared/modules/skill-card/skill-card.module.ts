import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillCardComponent } from './skill-card.component';
import { FormsModule } from '@angular/forms';



@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        SkillCardComponent
    ],
    exports: [
        SkillCardComponent
    ]
})
export class SkillCardModule { }
