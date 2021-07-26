import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessControlComponent } from './process-control.component';
import { ProcessDefinitionsComponent } from './process-definitions/process-definitions.component';
import { ProcessInstancesComponent } from './process-instances/process-instances.component';
import { ProcessControlRoutingModule } from './process-control.routing';


@NgModule({
    imports: [
        ProcessControlRoutingModule,
        CommonModule
    ],
    declarations: [
        ProcessDefinitionsComponent,
        ProcessInstancesComponent,
        ProcessControlComponent
    ],
})
export class ProcessControlModule { }
