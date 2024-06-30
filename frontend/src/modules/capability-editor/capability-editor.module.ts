import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapabilityEditorComponent } from './capability-editor.component';
import { CapabilityEditorRouting } from './capability-editor.routing';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        CapabilityEditorComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CapabilityEditorRouting
    ]
})
export class CapabilityEditorModule { }
