// Angular
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

// Routing
import { ModuleManagementRouter } from './module-management.routing';
import { ModuleManagementComponent } from './module-management.component';
import { ManufacturingServiceExecutor } from './manufacturing-service-executor.service';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        ModuleManagementRouter,
        FormsModule
    ],
    declarations: [
        ModuleManagementComponent,
    ],
    providers: [
        ManufacturingServiceExecutor
    ]
})
export class ModuleManagementModule { }
