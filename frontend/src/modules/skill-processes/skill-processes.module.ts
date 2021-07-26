import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillProcessesComponent } from './skill-processes.component';
import { SkillProcessesRoutingModule } from './skill-processes.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessControlComponent } from './process-control/process-control.component';
import { BpmnDiagramComponent } from './bpmn-diagram/bpmn-modeler.component';
import { PropertiesPanelComponent } from './bpmn-diagram/properties-panel/properties-panel.component';
import { DynamicPropertyComponent } from './bpmn-diagram/properties-panel/properties-subcomponents/dynamic-property/dynamic-property.component';
import { BpmnViewerModule } from '../../shared/modules/bpmn-viewer/bpmn-viewer.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BpmnViewerModule,
        SkillProcessesRoutingModule,
    ],
    declarations: [
        SkillProcessesComponent,
        BpmnDiagramComponent,
        PropertiesPanelComponent,
        DynamicPropertyComponent,
    ],
})
export class SkillProcessesModule { }
