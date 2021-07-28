import { AfterContentInit, Component, ElementRef, Input, OnDestroy, Output, ViewChild, EventEmitter } from '@angular/core';

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
import * as BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { Observable } from 'rxjs';
import { emptyXml } from './emptyDiagram';

@Component({
    selector: 'bpmn-modeler',
    templateUrl: './bpmn-modeler.component.html',
    styleUrls: ['./bpmn-modeler.component.scss']
})
export class BpmnDiagramComponent implements AfterContentInit, OnDestroy {
    private bpmnModeler: BpmnModeler;
    private dataModel;
    private elementRegistry;

    @ViewChild('ref', { static: true }) private el: ElementRef;

    @Input() set bpmnXml(bpmnXml: string) {
        if (bpmnXml) {
            this.bpmnModeler.importXML(bpmnXml);
        }
    }

    clickedElement: any;
    showPropertiesPanel: boolean;

    constructor() {
        this.bpmnModeler = new BpmnModeler();
        this.dataModel = this.bpmnModeler.get('modeling');
        this.elementRegistry = this.bpmnModeler.get('elementRegistry');

        this.bpmnModeler.importXML(emptyXml);



        console.log(this.elementRegistry);
        console.log(this.dataModel);

        // this.dataModel.updateProperties()

        // this.bpmnModeler.on('import.done', ({ error }) => {
        //     if (!error) {
        //         // this.bpmnModeler.get('canvas').zoom('fit-viewport');
        //     }
        // });
        this.bpmnModeler.on('element.click', (event) => this.onDiagramElementClicked(event));
    }

    clear() {
        this.bpmnModeler.importXML(emptyXml);
    }

    saveXml(): Promise<{xml: string}> {
        return this.bpmnModeler.saveXML({ format: true },);
    }

    ngAfterContentInit(): void {
        this.bpmnModeler.attachTo(this.el.nativeElement);
    }

    ngOnDestroy(): void {
        this.bpmnModeler.destroy();
    }


    onDiagramElementClicked(event): void {
        this.clickedElement = event.element;
    }


}
