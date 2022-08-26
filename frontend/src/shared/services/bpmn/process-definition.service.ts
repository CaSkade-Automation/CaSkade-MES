import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProcessDefinition, ProcessDefinitionDto } from '@shared/models/processDefinition/ProcessDefinition';
import { ProcessInstance, ProcessInstanceDto } from '@shared/models/processInstance/ProcessInstance';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'

})
export class ProcessDefinitionService {
    engineRestRoot = "/engine-rest";

    constructor(private http: HttpClient) { }

    getAllDeployedProcessDefinitions(): Observable<ProcessDefinition[]> {
        const URL = `${this.engineRestRoot}/process-definition`;
        return this.http.get<ProcessDefinitionDto[]>(URL).pipe(
            map((data: ProcessDefinitionDto[]) => data.map(processDefDto => new ProcessDefinition(
                processDefDto.id, processDefDto.key, processDefDto.category,
                processDefDto.description, processDefDto.name, processDefDto.version, processDefDto.resource,
                processDefDto.deploymentId,
                processDefDto.diagram, processDefDto.suspended, processDefDto.tenantId, processDefDto.versionTag,
                processDefDto.historyTimeToLive, processDefDto.startableInTasklist))
            ));

    }
    getDeployedProcessDefinitionById(processDefinitionId: string): Observable<ProcessDefinition> {
        console.log("Searching Def:" + processDefinitionId);
        const URL = `${this.engineRestRoot}/process-definition/${processDefinitionId}`;
        return this.http.get<ProcessDefinitionDto>(URL).pipe(
            map((data: ProcessDefinitionDto) => new ProcessDefinition(
                data.id, data.key, data.category,
                data.description, data.name, data.version, data.resource,
                data.deploymentId,
                data.diagram, data.suspended, data.tenantId, data.versionTag,
                data.historyTimeToLive, data.startableInTasklist))
        );

    }



    /**
     * Deletes a process definition with a given ID
     * @param processInstanceId ID of the process definition that will be deleted
     * @returns
     */
    deleteProcessDefinition(processInstanceId: string, cascade: boolean): Observable<void> {
        const URL = `${this.engineRestRoot}/process-definition/${processInstanceId}`;
        const options = {
            params: {
                cascade: cascade
            }
        };
        return this.http.delete<void>(URL, options);
    }


    getXMLofProcessDefinition(processDefinitionId: string): Observable<BpmnXmlResult> {
        const URL = `${this.engineRestRoot}/process-definition/${processDefinitionId}/xml`;
        return this.http.get<BpmnXmlResult>(URL);
    }


    /**
     * Starts a new instance of a given process definition
     * @param processDefinition Process Definition to start a new instance from
     * @param variablesBody Variables of the start form
     * @returns The new instance
     */
    startNewProcessInstance(processDefinition: ProcessDefinition, variablesBody: string): Observable<ProcessInstance> {
        const URL = `${this.engineRestRoot}/process-definition/${processDefinition.id}/start`;
        const body = variablesBody;
        return this.http.post<ProcessInstance>(URL, {});
    }



}

export class BpmnXmlResult {
    id: string;         // process definition id
    bpmn20Xml: string;  // The actual BPMN XML
}
