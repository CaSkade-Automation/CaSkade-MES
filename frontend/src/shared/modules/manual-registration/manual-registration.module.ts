import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualRegistrationComponent } from './manual-registration.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [ManualRegistrationComponent],
    exports: [ManualRegistrationComponent]
})
export class ManualRegistrationModule { }
