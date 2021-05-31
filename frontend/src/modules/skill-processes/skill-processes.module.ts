import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillProcessesComponent } from './skill-processes.component';
import { SkillProcessesRoutes } from './skill-processes.routing';
import { BpmnDiagramComponent } from './bpmn-component/bpmn-diagram.component';
import { PropertiesPanelComponent } from './bpmn-component/properties-panel/properties-panel.component';
import { DynamicPropertyComponent } from './bpmn-component/properties-panel/properties-subcomponents/dynamic-property/dynamic-property.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProcessControlComponent } from './process-control/process-control.component';


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
