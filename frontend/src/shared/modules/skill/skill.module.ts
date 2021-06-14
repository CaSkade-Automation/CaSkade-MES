import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillComponent } from './skill.component';
import { FormsModule } from '@angular/forms';



@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        SkillComponent
    ],
    exports: [
        SkillComponent
    ]
})
export class SkillModule { }
