import { AfterContentInit, Component, ElementRef, Input, OnDestroy, Output, ViewChild, EventEmitter } from '@angular/core';

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
import * as BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import * as propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import * as camundaModdleDescriptor from  'camunda-bpmn-moddle';
import { BpmnDataModel } from './BpmnDataModel';
import { emptyXml } from './emptyDiagram';

@Component({
    selector: 'bpmn-modeler',
    templateUrl: './bpmn-modeler.component.html',
    styleUrls: ['./bpmn-modeler.component.scss']
})
export class BpmnDiagramComponent implements AfterContentInit, OnDestroy {

    public bpmnModeler: BpmnModeler;       // bpmn-js modeler that is passed to the properties panel
    public clickedElement: any;            // Clicked BPMN element that is passed to the properties panel

    @ViewChild('ref', { static: true }) private el: ElementRef;     // Reference to the DOM element

    @Input() set bpmnXml(bpmnXml: string) {
        if (bpmnXml) {
            this.bpmnModeler.importXML(bpmnXml);
        }
    }



    constructor() {
        // setup the modler
        this.bpmnModeler = new BpmnModeler({
            additionalModules: [propertiesProviderModule],
            moddleExtensions: {
                camunda: camundaModdleDescriptor
            }
        });

        this.bpmnModeler.importXML(emptyXml).then(() => {
            // When done importing, get the process element and set it as the initial clicked element
            const process = this.bpmnModeler.get('canvas').getRootElement();
            this.clickedElement = process;
        });

        // Setup listener for later clicks
        this.bpmnModeler.on('element.click', (event) => this.onDiagramElementClicked(event));
    }


    /**
     * Bind the modeler to the DOM element as soon as the DOM is rendered
     */
    ngAfterContentInit(): void {
        this.bpmnModeler.attachTo(this.el.nativeElement);
    }

    /**
     * Free the DOM element and kill all listeners / BPMN services
     */
    ngOnDestroy(): void {
        this.bpmnModeler.destroy();
    }

    /**
     * Reset the modeler back to the initial process only containing a start event
     */
    clear(): void {
        this.bpmnModeler.importXML(emptyXml);
    }

    /**
     * Get the current model content in BPMN XML
     * @returns The current model state serialized in BPMN XML
     */
    saveXml(): Promise<{xml: string}> {
        return this.bpmnModeler.saveXML({ format: true },);
    }

    /**
     * Gets executed on every click on the modeler. Changes the selected element so that the properties panel changes
     * @param event Click event containing the clicked BPMN element
     */
    onDiagramElementClicked(event: any): void {
        this.clickedElement = event.element;
    }

}
