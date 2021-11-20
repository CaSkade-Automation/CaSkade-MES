import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillProcessesComponent } from './skill-processes.component';
import { SkillProcessesRoutingModule } from './skill-processes.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BpmnDiagramComponent } from './bpmn-diagram/bpmn-modeler.component';
import { PropertiesPanelComponent } from './bpmn-diagram/properties-panel/properties-panel.component';
import { BpmnViewerModule } from '../../shared/modules/bpmn-viewer/bpmn-viewer.module';
import { BaseTaskFormComponent } from './bpmn-diagram/properties-panel/properties-subcomponents/base-task-form/base-task-form.component';
import { SkillTaskFormComponent } from './bpmn-diagram/properties-panel/properties-subcomponents/skill-task-form/skill-task-form.component';
import { UserTaskFormComponent } from './bpmn-diagram/properties-panel/properties-subcomponents/user-task-form/user-task-form.component';
import { FlowFormComponent } from './bpmn-diagram/properties-panel/properties-subcomponents/flow-form/flow-form.component';
import { BpmnExtensionElementService } from './bpmn-diagram/properties-panel/bpmn-extension-element.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BpmnViewerModule,
        SkillProcessesRoutingModule,
    ],
    providers: [
        BpmnExtensionElementService
    ],
    declarations: [
        SkillProcessesComponent,
        BpmnDiagramComponent,
        PropertiesPanelComponent,
        BaseTaskFormComponent,
        SkillTaskFormComponent,
        UserTaskFormComponent,
        FlowFormComponent
    ],
})
export class SkillProcessesModule { }
