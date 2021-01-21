import {
    AfterContentInit,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    EventEmitter
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { emptyXml} from './emptyDiagram';

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
import * as BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';

import { importDiagram } from './rx';

import { throwError } from 'rxjs';
import { ProcessControlService } from '../process-control/process-control.service';
import { ProcessDefinition } from '@shared/models/processDefinition/ProcessDefinition';

@Component({
    selector: 'app-diagram',
    templateUrl: './bpmn-diagram.component.html',
    styles: [
        `
      .diagram-container {
        height: 100%;
        width: 100%;
      }
    `
    ]
})
export class BpmnDiagramComponent implements AfterContentInit, OnDestroy {
  private bpmnModeler: BpmnModeler;

  @ViewChild('ref', { static: true }) private el: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();

  @Input() private url: string;

  clickedElement: any;
  showPropertiesPanel: boolean;

  constructor(private http: HttpClient,
    private processControlService: ProcessControlService) {

      this.bpmnModeler = new BpmnModeler({
          //   container: '#canvas',
          //   width: '100vw',
          //   height: '100vh',
          //   additionalModules: [
          //       // {[InjectionNames.elementTemplates]: ['type', ElementTemplates.elementTemplates[1]]},
          //       // {[InjectionNames.propertiesProvider]: ['type', CamundaPropertiesProvider.propertiesProvider[1]]},

          //       // {[InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider]},

          //       PropertiesPanelModule
          //   ],
          //   propertiesPanel: {
          //       parent: '#properties'
          //   },
          //   moddleExtensions: {
          //       // camunda: CamundaModdleDescriptor
          //   }
      });


      this.bpmnModeler.importXML(emptyXml);
      const eventBus = this.bpmnModeler.get('eventBus');
      console.log(eventBus);
      this.bpmnModeler.on('element.click', (event) => this.onDiagramElementClicked(event));

      this.bpmnModeler.on('import.done', ({ error }) => {
          if (!error) {
              this.bpmnModeler.get('canvas').zoom('fit-viewport');
          }
      });
  }

  processDefinitions= Array<ProcessDefinition>();
  xml: string;
  ngAfterContentInit(): void {
      this.bpmnModeler.attachTo(this.el.nativeElement);
  }

  ngOnDestroy(): void {
      this.bpmnModeler.destroy();
  }


  onDiagramElementClicked(event) {
      console.log("showingPanel");
      this.clickedElement = event.element;
      console.log(this.clickedElement);


      this.showPropertiesPanel = !this.showPropertiesPanel;
  }

  saveProcess(): void {
      this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
          const processXml = xml;
      });
  }

  /**
   * Load diagram from URL and emit completion event
   */
  //   loadUrl(url: string) {

  //       return (
  //           this.http.get(url, { responseType: 'text' }).pipe(
  //               catchError(err => throwError(err)),
  //               importDiagram(this.bpmnJS)
  //           ).subscribe(
  //               (warnings) => {
  //                   this.importDone.emit({
  //                       type: 'success',
  //                       warnings
  //                   });
  //               },
  //               (err) => {
  //                   this.importDone.emit({
  //                       type: 'error',
  //                       error: err
  //                   });
  //               }
  //           )
  //       );
  //   }
  listAllDeployedProcessDefinitions(): void{
      this.processControlService.getAllDeployedProcessDefinitions().subscribe((processDefinitions: ProcessDefinition[]) =>{
          this.processDefinitions=processDefinitions;});}
  loadProcess(processDefinition: ProcessDefinition): void{
      this.processControlService.getXMLofProcessDefinition(processDefinition).subscribe(data=>{
          this.xml= data.bpmn20Xml;});
  }
  showSelectedDefinition(): void{
      this.bpmnModeler.importXML(this.xml);
  }
}
