import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BpmnViewerComponent } from './bpmn-viewer.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [BpmnViewerComponent],
    declarations: [BpmnViewerComponent]
})
export class BpmnViewerModule { }
