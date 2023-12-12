import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BpmnModelerComponent } from './bpmn-modeler.component';
import { PropertiesPanelComponent } from './properties-panel/properties-panel.component';
import { BaseTaskFormComponent } from './properties-panel/properties-subcomponents/base-task-form/base-task-form.component';
import { CapabilityTaskFormComponent } from './properties-panel/properties-subcomponents/service-task-form/service-subcomponents/capability-task-form/capability-task-form.component';
import { ServiceTaskFormComponent } from './properties-panel/properties-subcomponents/service-task-form/service-task-form.component';
import { SkillTaskFormComponent } from './properties-panel/properties-subcomponents/service-task-form/service-subcomponents/skill-task-form/skill-task-form.component';
import { UserTaskFormComponent } from './properties-panel/properties-subcomponents/user-task-form/user-task-form.component';
import { SendTaskFormComponent } from './properties-panel/properties-subcomponents/send-task-form/send-task-form.component';
import { MailFormComponent } from './properties-panel/properties-subcomponents/send-task-form/mail-form/mail-form.component';
import { FlowFormComponent } from './properties-panel/properties-subcomponents/flow-form/flow-form.component';
import { BpmnModelService } from './properties-panel/bpmn-model.service';
import { BpmnExtensionElementService } from './properties-panel/bpmn-extension-element.service';
import { CamundaMailService } from './properties-panel/bpmn-mail.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers:[
        BpmnModelService,
        BpmnExtensionElementService,
        CamundaMailService
    ],
    declarations: [
        BpmnModelerComponent,
        PropertiesPanelComponent,
        BaseTaskFormComponent,
        CapabilityTaskFormComponent,
        ServiceTaskFormComponent,
        SkillTaskFormComponent,
        UserTaskFormComponent,
        SendTaskFormComponent,
        MailFormComponent,
        FlowFormComponent
    ],
    exports: [BpmnModelerComponent]
})
export class BpmnModelerModule { }
