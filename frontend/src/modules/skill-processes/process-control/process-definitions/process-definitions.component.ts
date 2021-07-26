import { Component, OnInit } from '@angular/core';
import { ProcessDefinition } from '../../../../../models/processDefinition/ProcessDefinition';
import { ProcessInstance } from '../../../../../models/ProcessInstance/ProcessInstance';
import { ProcessControlService } from '../process-control.service';

@Component({
    selector: 'process-definitions',
    templateUrl: './process-definitions.component.html',
    styleUrls: ['./process-definitions.component.scss']
})
export class ProcessDefinitionsComponent implements OnInit {


    constructor(private processControlService: ProcessControlService) {}
    processDefinitions= Array<ProcessDefinition>();
    processInstances= Array<ProcessInstance>();
    selectedDefinition: ProcessDefinition;
    instanceOperate: ProcessInstance;
    jsn: string;
    bpmnXml: string;
    processDefinitionIdOfXml: string;


    ngOnInit(): void {
        console.log("init");
        this.processControlService.getAllDeployedProcessDefinitions().subscribe((processDefinitions: ProcessDefinition[]) =>{
            this.processDefinitions=processDefinitions;
        }
        );
        this.processControlService.getAllProcessInstances().subscribe((processInstances: ProcessInstance[])=>{
            this.processInstances=processInstances;
        });

    }
    getDiagram(processDefinitionId: string): void{
        this.processControlService.getDeployedProcessDefinitionById(processDefinitionId).subscribe((processDefinition: ProcessDefinition) =>{
            this.selectedDefinition=processDefinition;
        });
        console.log("Diagram:");

        // console.log(this.selectedDefinition);
    }

    deleteProcessInstance(processInstance: ProcessInstance): void{
        this.processControlService.deleteProcessInstance(processInstance).subscribe((processInstances: ProcessInstance[])=>{
            this.processInstances=processInstances;
        });
    }
    getXmlOfProcessDefinition(processDefinitionId: string):  string{
        this.processControlService.getXMLofProcessDefinition(processDefinitionId).subscribe(data=>{
            this.bpmnXml= data.bpmn20Xml;
            this.processDefinitionIdOfXml= data.id;
            console.log(this.bpmnXml);
        });
        return this.bpmnXml;

    }
    startInstance(processDefinition: ProcessDefinition,  variablesBody: string): void{
        const body=variablesBody;
        this.processControlService.startNewProcessInstance(processDefinition, body );
    }

}
