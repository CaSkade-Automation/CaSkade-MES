import { AfterContentInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import * as BpmnViewer from 'bpmn-js/dist/bpmn-viewer.production.min.js';
import { ProcessDefinitionService } from '../../services/bpmn/process-definition.service';
import { ActivityInstanceTree } from '../../services/bpmn/process-instance.service';

@Component({
    selector: 'bpmn-viewer',
    templateUrl: './bpmn-viewer.component.html',
    styleUrls: ['./bpmn-viewer.component.scss']
})
export class BpmnViewerComponent implements AfterContentInit, OnDestroy {
    private bpmnViewer: BpmnViewer;
    private eventBus: any;

    @ViewChild('ref', { static: true }) private el: ElementRef;

    @Input() set bpmnXml(bpmnXml: string) {
        if (bpmnXml) {
            this.bpmnViewer.importXML(bpmnXml).then();
        }
    }

    @Input() set activeActivityId(activeActivity: ActivityInstanceTree) {

        if (activeActivity) {
            const childId = activeActivity.childActivityInstances[0].activityId;

            this.eventBus.on('import.done', () => {
                const overlays = this.bpmnViewer.get('overlays');

                // attach an overlay to display the current activity
                overlays.add(childId, {
                    position: {
                        bottom: 15,
                        left: -5
                    },
                    html:'<i style="font-size:2rem; color: rgba(10, 255, 141, 0.8)" class="fas fa-map-marker"></i>'
                });
            });
        }
    }

    constructor() {
        this.bpmnViewer = new BpmnViewer();
        this.eventBus = this.bpmnViewer.get('eventBus');
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
