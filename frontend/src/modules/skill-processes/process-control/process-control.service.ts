import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProcessDefinition, ProcessDefinitionDto } from '@shared/models/processDefinition/ProcessDefinition';
import { ProcessInstance, ProcessInstanceDto } from '@shared/models/ProcessInstance/ProcessInstance';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
   
})
export class ProcessControlService {
  engineRestRoot= "/engine-rest";
  xml: string;
  
  //observer: Observer<ProcessDefinitionDto[]>
  constructor(private  http: HttpClient) {}

  getAllDeployedProcessDefinitions(): Observable<ProcessDefinition[]>{
      console.log("Loading deployed Process-Definitions...");
      const URL=`${this.engineRestRoot}/process-definition`;
      return this.http.get<ProcessDefinitionDto[]>(URL).pipe(
          map((data: ProcessDefinitionDto[]) => data.map(processDefDto => new ProcessDefinition(
              processDefDto.id,processDefDto.key, processDefDto.category,
              processDefDto.description, processDefDto.name, processDefDto.version, processDefDto.resource,
              processDefDto.deploymentId,
              processDefDto.diagram, processDefDto.suspended, processDefDto.tenantId, processDefDto.versionTag,
              processDefDto.historyTimeToLive, processDefDto.startableInTasklist))
          ));
          
  }
  getDeployedProcessDefinitionById(processDefinitionId: string): Observable<ProcessDefinition>{
      console.log("Searching Def:"+processDefinitionId);
      const URL=`${this.engineRestRoot}/process-definition/${processDefinitionId}`;
      return this.http.get<ProcessDefinitionDto>(URL).pipe(
          map((data: ProcessDefinitionDto) => new ProcessDefinition(
              data.id,data.key, data.category,
              data.description, data.name, data.version, data.resource,
              data.deploymentId,
              data.diagram, data.suspended, data.tenantId, data.versionTag,
              data.historyTimeToLive, data.startableInTasklist))
      );

  }

  getAllProcessInstances(): Observable<ProcessInstance[]>{
      console.log("Loading Process-Instances...");
      const URL=`${this.engineRestRoot}/process-instance`; 
      return this.http.get<ProcessInstanceDto[]>(URL).pipe(
          map((data: ProcessInstanceDto[]) => data.map(processInstDto => new ProcessInstance(processInstDto.links,
              processInstDto.id, processInstDto.definitionId, processInstDto.businessKey, processInstDto.caseInstanceId, 
              processInstDto.ended, processInstDto.suspended, processInstDto.tenantId
    
          ))
          ));
    

  }
  deleteProcessInstance(processInstance: ProcessInstance): Observable<ProcessInstance[]> {
      const URL= `${this.engineRestRoot}/process-instance/${processInstance.id}`;
      console.log(URL);
    
      this.http.delete(URL).subscribe();

      return this.getAllProcessInstances();
      
  }
  getXMLofProcessDefinition(processDefinition: ProcessDefinition): any{
      const URL= `${this.engineRestRoot}/process-definition/${processDefinition.id}/xml`; 
      
  
  
      return this.http.get<any>(URL);
      //   .subscribe(data=>{
      //       this.xml=data.bpmn20Xml;
      //console.log(this.xml);
      // });
  }
 
 

}


  