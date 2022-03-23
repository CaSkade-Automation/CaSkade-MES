import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProcessDefinition } from '../../../models/processDefinition/ProcessDefinition';
import { DeploymentRequest, DeploymentService } from '../../shared/services/bpmn/deployment.service';
import { ProcessDefinitionService } from '../../shared/services/bpmn/process-definition.service';
import { MessageService } from '../../shared/services/message.service';
import { BpmnDiagramComponent } from './bpmn-diagram/bpmn-modeler.component';

@Component({
    selector: 'app-skill-processes',
    templateUrl: './production-processes.component.html',
    styleUrls: ['./production-processes.component.scss']
})
export class ProductionProcessesComponent implements AfterContentInit{
    uploadedFile: Blob;
    importError?: Error;
    processDefinitions: ProcessDefinition[]
    bpmnXml: string;
    previewXml = "";

    deploymentForm = new FormGroup({
        deploymentName: new FormControl("", [Validators.required]),
        tenantId: new FormControl("")
    })
    xmlToDeploy: string;

    @ViewChild('modelerComponent') modelerComponent: BpmnDiagramComponent;

    processSelector = new FormControl("");
    selectedProcessDefinition: ProcessDefinition;

    constructor(
        private processDefinitionService: ProcessDefinitionService,
        private deploymentService: DeploymentService,
        private messageService: MessageService) {}

    ngAfterContentInit(): void {
        this.processSelector.valueChanges.subscribe(selectedProcess => {
            this.processDefinitionService.getXMLofProcessDefinition(selectedProcess.id).subscribe(data => {
                this.previewXml  = data.bpmn20Xml;
            });
        });
    }

    clearDiagram() {
        this.modelerComponent.clear();
    }

    async getProcessXML(): Promise<void> {
        this.xmlToDeploy = (await this.modelerComponent.saveXml()).xml;
    }

    deployProcess(): void {
        const deploymentName = this.deploymentForm.get('deploymentName').value;
        const tenantId = this.deploymentForm.get('tenantId').value;
        const deploymentRequest = new DeploymentRequest(deploymentName, "data", this.xmlToDeploy, false, false, tenantId);
        this.deploymentService.deployProcess(deploymentRequest).subscribe(data => {
            this.messageService.info("New Process deployed", "Deployed a new process to the BPMN engine");
            console.log(data);
        });
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

    fileChanged(event: any) {
        this.uploadedFile = event.target.files[0];
    }

    loadFromFile(): void {
        const reader = new FileReader();
        reader.onload = () => {
            this.bpmnXml = reader.result as string;
        };
        reader.readAsText(this.uploadedFile);
    }

    openInModeler(): void {
        this.bpmnXml = this.previewXml;
    }
}
