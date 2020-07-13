import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandFeatureComponent } from './command-feature.component';



@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CommandFeatureComponent
    ],
    exports: [
        CommandFeatureComponent
    ]
})
export class CommandFeatureModule { }
