import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillProcessesComponent } from './skill-processes.component';
import { SkillProcessesRoutes } from './skill-processes.routing';
import { BpmnDiagramComponent } from './bpmn-component/bpmn-diagram.component';

@NgModule({
    imports: [
        CommonModule,
        SkillProcessesRoutes
    ],
    declarations: [
        SkillProcessesComponent,
        BpmnDiagramComponent
    ]
})
export class SkillProcessesModule { }
