import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionProcessesComponent } from './production-processes.component';
import { SkillProcessesRoutingModule } from './production-processes.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BpmnViewerModule } from '../../shared/modules/bpmn-viewer/bpmn-viewer.module';
import { BpmnModelerModule } from '../../shared/modules/bpmn-modeler/bpmn-modeler.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BpmnViewerModule,
        BpmnModelerModule,
        SkillProcessesRoutingModule,
    ],
    providers: [],
    declarations: [
        ProductionProcessesComponent,
    ],
})
export class ProductionProcessesModule { }
