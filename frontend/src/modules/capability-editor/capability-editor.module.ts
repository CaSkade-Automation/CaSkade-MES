import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapabilityEditorComponent } from './capability-editor.component';
import { CapabilityEditorRouting } from './capability-editor.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { FpbStateIconComponent } from './fpbStateIcons/fpb-state-icon.component';



@NgModule({
    declarations: [
        CapabilityEditorComponent,
        FpbStateIconComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CapabilityEditorRouting
    ]
})
export class CapabilityEditorModule { }
