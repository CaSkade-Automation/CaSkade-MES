import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillProcessesComponent } from './skill-processes.component';
import { SkillProcessesRoutes } from './skill-processes.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProcessControlComponent } from './process-control/process-control.component';
import { BpmnDiagramComponent } from './bpmn-diagram/bpmn-modeler.component';
import { PropertiesPanelComponent } from './bpmn-diagram/properties-panel/properties-panel.component';
import { DynamicPropertyComponent } from './bpmn-diagram/properties-panel/properties-subcomponents/dynamic-property/dynamic-property.component';


@NgModule({
    imports: [
        CommonModule,
        SkillProcessesRoutes,
        ReactiveFormsModule
    ],
    declarations: [
        SkillProcessesComponent,
        BpmnDiagramComponent,
        PropertiesPanelComponent,
        DynamicPropertyComponent,
        ProcessControlComponent
    ],
})
export class SkillProcessesModule { }
