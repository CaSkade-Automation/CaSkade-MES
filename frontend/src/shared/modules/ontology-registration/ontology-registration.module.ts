import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntologyRegistrationComponent } from './ontology-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManualRegistrationComponent } from './manual-registration/manual-registration.component';
import { MtpMappingComponent } from './mtp-mapping/mtp-mapping.component';
import { PlcMappingComponent } from './plc-mapping/plc-mapping.component';
import { DirectivesModule } from '../../directives/Directives.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivesModule
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
