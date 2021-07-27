import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProcessDefinition } from '@shared/models/processDefinition/ProcessDefinition';
import { ProcessInstance } from '@shared/models/processInstance/ProcessInstance';
import { take } from 'rxjs/operators';
import { MessageService } from '../../../../shared/services/message.service';
import { ProcessDefinitionService } from '../../../../shared/services/process-definition.service';

@Component({
    selector: 'process-definitions',
    templateUrl: './process-definitions.component.html',
    styleUrls: ['./process-definitions.component.scss']
})
export class ProcessDefinitionsComponent implements OnInit {

    detailsShown: boolean[];
    processDetails: ProcessDetail[];

    processDefinitionToStart: ProcessDefinition;        // A definition that has been selected to be started
    processDefinitionToDelete: ProcessDefinition;       // A definition that has been selected to be deleted
    deleteCascading = new FormControl(false);

    processDefinitions = Array<ProcessDefinition>();

    selectedDefinition: ProcessDefinition;
    instanceOperate: ProcessInstance;
    jsn: string;
    modalXml: string;


    constructor(
        private processDefinitionService: ProcessDefinitionService,
        private messageService: MessageService
    ) { }


    ngOnInit(): void {
        this.processDefinitionService.getAllDeployedProcessDefinitions().subscribe((processDefinitions: ProcessDefinition[]) => {
            this.detailsShown = new Array<boolean>(processDefinitions.length);
            this.processDetails = new Array<ProcessDetail>(processDefinitions.length);
            this.processDefinitions = processDefinitions;
        });
    }

    getDiagram(processDefinitionId: string): void {
        this.processDefinitionService.getDeployedProcessDefinitionById(processDefinitionId).subscribe((processDefinition: ProcessDefinition) => {
            this.selectedDefinition = processDefinition;
        });
        console.log("Diagram:");

        // console.log(this.selectedDefinition);
    }


    showDetails(i: number, processDefinition: ProcessDefinition) {
        if (this.processDetails[i]) {
            this.processDetails[i] = null;
            this.detailsShown[i] = false;
            return;
        }

        this.processDefinitionService.getXMLofProcessDefinition(processDefinition.id).subscribe(res => {
            this.processDetails[i] = new ProcessDetail(res.bpmn20Xml, processDefinition);
            this.detailsShown[i] = true;
        });

    }


    selecteProcessDefinitionToDelete(processDefinition: ProcessDefinition): void {
        this.processDefinitionToDelete = processDefinition;
    }

    deleteProcessDefinition(): void {
        const idToDelete = this.processDefinitionToDelete.id;
        const cascade = this.deleteCascading.value;

        this.processDefinitionService.deleteProcessDefinition(idToDelete, cascade).pipe(take(1)).subscribe({
            next: data => {
                const body = `Deleted process definition with id ${idToDelete}`;
                this.messageService.info("Process Definition deleted", body);
                this.processDefinitionService.getAllDeployedProcessDefinitions().pipe(take(1)).subscribe(definitions => this.processDefinitions = definitions);
            },
            error: (error: HttpErrorResponse) => {
                const body = `Error while deleting process definition with id ${idToDelete}\n
                Error: ${error.message}
                `;
                this.messageService.danger("Error while deleting process", body);
            }
        });
    }

    setModalXml(processDefinitionId: string): void {
        this.processDefinitionService.getXMLofProcessDefinition(processDefinitionId).subscribe(data => {
            this.modalXml = data.bpmn20Xml;
        });
    }

    setProcessDefintionToStart(processDefinition: ProcessDefinition) {
        this.processDefinitionToStart = processDefinition;
    }

    startProcessInstance(): void {
        const body = "";
        this.processDefinitionService.startNewProcessInstance(this.processDefinitionToStart, body).subscribe(res => console.log(res));
    }

}

export class ProcessDetail extends ProcessDefinition {

    constructor(public bpmn20Xml: string, definition: ProcessDefinition) {
        super(definition.id,
            definition.key,
            definition.category,
            definition.description,
            definition.name,
            definition.version,
            definition.resource,
            definition.deploymentId,
            definition.diagram,
            definition.suspended,
            definition.tenantId,
            definition.versionTag,
            definition.historyTimeToLive,
            definition.startableInTasklist);
    }
}
