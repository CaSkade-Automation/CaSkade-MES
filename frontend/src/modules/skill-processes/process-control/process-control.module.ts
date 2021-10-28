import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessControlComponent } from './process-control.component';
import { ProcessDefinitionsComponent } from './process-definitions/process-definitions.component';
import { ProcessInstancesComponent } from './process-instances/process-instances.component';
import { ProcessControlRoutingModule } from './process-control.routing';
import { BpmnViewerModule } from '../../../shared/modules/bpmn-viewer/bpmn-viewer.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
        ProcessControlRoutingModule,
        CommonModule,
        BpmnViewerModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ProcessDefinitionsComponent,
        ProcessInstancesComponent,
        ProcessControlComponent
    ],
})
export class ProcessControlModule { }
