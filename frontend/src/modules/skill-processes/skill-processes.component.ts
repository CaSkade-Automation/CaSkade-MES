import { Component } from '@angular/core';
import { ProcessDefinition } from '../../../models/processDefinition/ProcessDefinition';
import { ProcessControlService } from './process-control/process-control.service';


@Component({
    selector: 'app-skill-processes',
    templateUrl: './skill-processes.component.html',
    styleUrls: ['./skill-processes.component.scss']
})
export class SkillProcessesComponent {
    // diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
    importError?: Error;
    processDefinitions: ProcessDefinition[]
    xml: string;
    selectedXml: string;
    constructor(private processControlService: ProcessControlService) {}

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

    listAllDeployedProcessDefinitions(): void{
        this.processControlService.getAllDeployedProcessDefinitions().subscribe((processDefinitions: ProcessDefinition[]) =>{
            this.processDefinitions=processDefinitions;});}

    loadProcess(processDefinition: ProcessDefinition): void{
        this.processControlService.getXMLofProcessDefinition(processDefinition).subscribe(data => {
            this.xml= data.bpmn20Xml;
        });
    }

    showSelectedDefinition(): void {
        this.xml = this.selectedXml;
    }
}
