import { AfterContentInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import * as BpmnViewer from 'bpmn-js/dist/bpmn-viewer.production.min.js';
import { ProcessDefinitionService } from '../../services/process-definition.service';

@Component({
    selector: 'bpmn-viewer',
    templateUrl: './bpmn-viewer.component.html',
    styleUrls: ['./bpmn-viewer.component.scss']
})
export class BpmnViewerComponent implements AfterContentInit, OnDestroy {
    private bpmnViewer: BpmnViewer;

    @ViewChild('ref', { static: true }) private el: ElementRef;

    @Input() set bpmnXml(bpmnXml: string) {
        if (bpmnXml) {
            this.bpmnViewer.importXML(bpmnXml);
        }
    }

    constructor() {
        this.bpmnViewer = new BpmnViewer();
        this.bpmnViewer.on('import.done', () => {
            this.bpmnViewer.get('canvas').zoom('fit-viewport');
        });
    }

    ngAfterContentInit(): void {
        this.bpmnViewer.attachTo(this.el.nativeElement);
    }

    ngOnDestroy(): void {
        this.bpmnViewer.destroy();
    }
}
