import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandFeatureComponent } from './command-feature.component';
import { FormsModule } from '@angular/forms';



@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        CommandFeatureComponent
    ],
    exports: [
        CommandFeatureComponent
    ]
})
export class CommandFeatureModule { }
