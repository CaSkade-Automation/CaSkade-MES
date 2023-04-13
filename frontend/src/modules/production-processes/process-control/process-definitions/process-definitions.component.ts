import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProcessDefinition } from '@shared/models/processDefinition/ProcessDefinition';
import { ProcessInstance } from '@shared/models/processInstance/ProcessInstance';
import { map, take } from 'rxjs/operators';
import { MessageService } from '../../../../shared/services/message.service';
import { BpmnStartFormVariable, ProcessDefinitionService } from '../../../../shared/services/bpmn/process-definition.service';
import { Modal } from 'bootstrap';
import { Observable } from 'rxjs';

@Component({
    selector: 'process-definitions',
    templateUrl: './process-definitions.component.html',
    styleUrls: ['./process-definitions.component.scss']
})
export class ProcessDefinitionsComponent implements OnInit {

    @ViewChild('startModal') startModalElement: ElementRef;
    startModal: Modal;
    @ViewChild('deleteModal') deleteModalElement: ElementRef;
    deleteModal: Modal;
    @ViewChild('xmlModal') xmlModalElement: ElementRef;
    xmlModal: Modal;

    detailsShown: boolean[];
    processDetails: ProcessDetail[];

    processDefinitionToStart: ProcessDefinition;        // A definition that has been selected to be started
    processDefinitionToDelete: ProcessDefinition;       // A definition that has been selected to be deleted
    deleteCascading = new FormControl(false);

    processDefinitions = Array<ProcessDefinition>();

    currentStartFormVariables$: Observable<Record<string, BpmnStartFormVariable>>
    numberOfCurrentStartFormVariables$: Observable<number>
    selectedDefinition: ProcessDefinition;
    instanceOperate: ProcessInstance;
    modalXml: string;


    constructor(
        private processDefinitionService: ProcessDefinitionService,
        private messageService: MessageService
    ) { }


    ngOnInit(): void {
        this.processDefinitionService.getAllDeployedProcessDefinitions().subscribe((processDefinitions: ProcessDefinition[]) => {
            this.detailsShown = new Array<boolean>(processDefinitions.length).fill(false);
            this.processDetails = new Array<ProcessDetail>(processDefinitions.length);
            this.processDefinitions = processDefinitions;
        });
    }

    getDiagram(processDefinitionId: string): void {
        this.processDefinitionService.getDeployedProcessDefinitionById(processDefinitionId).subscribe((processDefinition: ProcessDefinition) => {
            this.selectedDefinition = processDefinition;
        });
    }


    showDetails(i: number, processDefinition: ProcessDefinition): void {
        this.processDefinitionService.getXMLofProcessDefinition(processDefinition.id).subscribe(res => {
            this.processDetails[i] = new ProcessDetail(res.bpmn20Xml, processDefinition);
            // Hide all but this one
            this.detailsShown.fill(false);
            this.detailsShown[i] = true;
        });

    }

    selecteProcessDefinitionToDelete(processDefinition: ProcessDefinition): void {
        const deleteModalElem = this.deleteModalElement.nativeElement;
        this.deleteModal = new Modal(deleteModalElem);
        this.processDefinitionToDelete = processDefinition;
        this.deleteModal.show();
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
        const xmlModalElem = this.xmlModalElement.nativeElement;
        this.xmlModal = new Modal(xmlModalElem);
        this.processDefinitionService.getXMLofProcessDefinition(processDefinitionId).subscribe(data => {
            this.modalXml = data.bpmn20Xml;
            this.xmlModal.show();
        });
    }

    setProcessDefintionToStart(processDefinition: ProcessDefinition): void {
        this.processDefinitionToStart = processDefinition;
        this.currentStartFormVariables$ = this.processDefinitionService.getStartFormVariables(processDefinition.id);
        this.numberOfCurrentStartFormVariables$ = this.currentStartFormVariables$.pipe(map(val => Object.keys(val).length));

        const elem = this.startModalElement.nativeElement;
        this.startModal = new Modal(elem);
        this.startModal.show();
    }

    startProcessInstance(): void {
        const body = "";
        this.processDefinitionService.startNewProcessInstance(this.processDefinitionToStart, body).subscribe({
            next: () => this.messageService.success("Process running", `BPMN process with id ${this.processDefinitionToStart.id} was sucessfully started and is running.`),
            error: (err) => this.messageService.warn("BPMN Error", `Error while starting process with ID ${this.processDefinitionToStart.id}. ${err}.`)
        });
        this.startModal.hide();
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
