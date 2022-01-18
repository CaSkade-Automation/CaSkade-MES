import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntologyRegistrationComponent } from './ontology-registration.component';
import { FormsModule } from '@angular/forms';
import { ManualRegistrationComponent } from './manual-registration/manual-registration.component';
import { MtpMappingComponent } from './mtp-mapping/mtp-mapping.component';
import { PlcMappingComponent } from './plc-mapping/plc-mapping.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        OntologyRegistrationComponent,
        ManualRegistrationComponent,
        MtpMappingComponent,
        PlcMappingComponent
    ],
    exports: [OntologyRegistrationComponent]
})
export class OntologyRegistrationModule { }
