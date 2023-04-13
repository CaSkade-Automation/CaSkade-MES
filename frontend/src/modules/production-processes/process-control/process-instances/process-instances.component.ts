import { Component, OnInit } from '@angular/core';
import { forkJoin, merge, Observable, Subscription } from 'rxjs';
import { combineAll, map, take } from 'rxjs/operators';
import { ProcessInstance, ProcessInstanceDto } from '@shared/models/processInstance/ProcessInstance';
import { BpmnXmlResult, ProcessDefinitionService } from '../../../../shared/services/bpmn/process-definition.service';
import { ActivityInstanceTree, ProcessInstanceService } from '../../../../shared/services/bpmn/process-instance.service';

@Component({
    selector: 'process-instances',
    templateUrl: './process-instances.component.html',
    styleUrls: ['./process-instances.component.scss']
})
export class ProcessInstancesComponent implements OnInit {

    selectedInstance: DetailedInstance;

    processInstances = Array<ProcessInstance>();
    detailsShown: Array<boolean>;
    instanceDetails: Array<DetailedInstance>

    constructor(
        private instanceService: ProcessInstanceService,
        private definitionService: ProcessDefinitionService) { }

    ngOnInit(): void {
        this.loadAllProcessInstances();
    }

    loadAllProcessInstances(): void {
        this.instanceService.getAllProcessInstances().subscribe((processInstances: ProcessInstance[]) => {
            this.processInstances = processInstances;
            this.detailsShown = new Array<boolean>(processInstances.length);
            this.instanceDetails = new Array<DetailedInstance>(processInstances.length);
        });
    }

    /**
     * Suspends an instance with a given instance ID
     * @param processInstanceId ID of the instance to suspend
     */
    suspendInstance(processInstanceId: string): void {
        this.instanceService.suspendInstance(processInstanceId, true).subscribe(() => this.loadAllProcessInstances());
    }


    /**
     * Activates an instance with a given instance ID
     * @param processInstanceId ID of the instance to activate
     */
    activateInstance(processInstanceId: string): void {
        this.instanceService.suspendInstance(processInstanceId, false).subscribe(() => this.loadAllProcessInstances());
    }


    /**
     * Displays an instance in the viewer
     * @param processInstance Process Instance to display
     */
    showInViewer(processInstance: ProcessInstance): void {
        // this.selectedInstance = null;
        this.getCompleteInstanceDetails(processInstance).subscribe(res => this.selectedInstance = res);
    }


    /**
     * Shows details of a given process instance in a separate collapse element
     * @param i Index of the instance
     * @param processInstance Process instance to show details of
     */
    showDetails(i: number, processInstance: ProcessInstance): void {
        this.detailsShown[i] = !this.detailsShown[i];
        this.getCompleteInstanceDetails(processInstance).subscribe(res => this.instanceDetails[i] = res);
    }


    private getCompleteInstanceDetails(processInstance: ProcessInstance): Observable<DetailedInstance>  {
        const merged = forkJoin({
            activity: this.instanceService.getActivityInstance(processInstance.id),
            xml: this.definitionService.getXMLofProcessDefinition(processInstance.definitionId)
        });

        return merged.pipe(
            map(merged => new DetailedInstance(processInstance, merged.activity, merged.xml))
        );
    }
}


class DetailedInstance {
    public xml: string;

    activeChildIds = new Array<string>();

    constructor(
        public instance: ProcessInstance,
        public activity: ActivityInstanceTree,
        xmlResult: BpmnXmlResult) {
        this.xml = xmlResult.bpmn20Xml;
        this.getNestestChildActivities(this.activity);
    }

    private getNestestChildActivities(activityInstance: ActivityInstanceTree): void {
        if (activityInstance.childActivityInstances.length == 0) {
            this.activeChildIds.push(activityInstance.activityId);
            return;
        }
        activityInstance.childActivityInstances.forEach(childActivityInstance => {
            this.getNestestChildActivities(childActivityInstance);
        });
    }
}
