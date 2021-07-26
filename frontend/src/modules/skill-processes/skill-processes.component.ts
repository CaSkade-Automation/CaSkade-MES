import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProcessDefinition } from '../../../models/processDefinition/ProcessDefinition';
import { ProcessDefinitionService } from '../../shared/services/process-definition.service';


@Component({
    selector: 'app-skill-processes',
    templateUrl: './skill-processes.component.html',
    styleUrls: ['./skill-processes.component.scss']
})
export class SkillProcessesComponent implements AfterContentInit{
    // diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
    importError?: Error;
    processDefinitions: ProcessDefinition[]
    bpmnXml: string;
    previewXml = "";

    processSelector = new FormControl("");
    selectedProcessDefinition: ProcessDefinition;

    constructor(private processDefinitionService: ProcessDefinitionService) {}

    ngAfterContentInit(): void {
        this.processSelector.valueChanges.subscribe(selectedProcess => {
            console.log(selectedProcess);

            this.processDefinitionService.getXMLofProcessDefinition(selectedProcess.id).subscribe(data => {
                this.previewXml  = data.bpmn20Xml;
            });
        });
    }

    handleImported(event): void {
        const { type, error, warnings } = event;

        if (type === 'success') {
            console.log(`Rendered diagram (%s warnings)`, warnings.length);
        }

        if (type === 'error') {
            console.error('Failed to render diagram', error);
        }

        this.importError = error;
    }


    saveProcess(): void {
        // this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
        //     const processXml = xml;
        // });
    }

    listAllDeployedProcessDefinitions(): void{
        this.processDefinitionService.getAllDeployedProcessDefinitions().subscribe((processDefinitions: ProcessDefinition[]) =>{
            this.processDefinitions=processDefinitions;});}

    loadProcess(): void{
        this.processDefinitionService.getXMLofProcessDefinition(this.selectedProcessDefinition.id).subscribe(data => {
            this.bpmnXml= data.bpmn20Xml;
            console.log(this.bpmnXml);

        });
    }

    openInModeler(): void {
        this.bpmnXml = this.previewXml;
    }
}
