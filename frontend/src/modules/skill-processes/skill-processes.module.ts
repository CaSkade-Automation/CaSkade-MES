import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillProcessesComponent } from './skill-processes.component';
import { SkillProcessesRoutes } from './skill-processes.routing';
import { BpmnDiagramComponent } from './bpmn-component/bpmn-diagram.component';
import { PropertiesPanelComponent } from './bpmn-component/properties-panel/properties-panel.component';

@NgModule({
    imports: [
        CommonModule,
        SkillProcessesRoutes
    ],
    declarations: [
        SkillProcessesComponent,
        BpmnDiagramComponent,
        PropertiesPanelComponent
    ]
})
export class SkillProcessesModule { }
