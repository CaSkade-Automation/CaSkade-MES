import { Component, OnInit } from '@angular/core';
import { SocketService } from "../../shared/services/socket.service";
import { HttpClient } from '@angular/common/http';
import { ManufacturingModule, ServiceExecutionDescription, Method, SelectedParameter } from './self-description';
import { ModuleManagementService } from './module-management.service';
import { ManufacturingServiceExecutor } from './manufacturing-service-executor.service';

@Component({
  selector: 'module-management',
  templateUrl: 'module-management.component.html',
})
export class ModuleManagementComponent implements OnInit {
  
  constructor(private httpClient: HttpClient, 
    private socketService: SocketService,
    private moduleManagementService: ModuleManagementService,
    private mfgServiceExecutor: ManufacturingServiceExecutor) {}

  incomingmsg = [];
  modules = new Array<ManufacturingModule>();
  serviceExecutionDescription: ServiceExecutionDescription;
  parameterValues = new Array<string>();
  
  ngOnInit() {
    let modules = this.moduleManagementService.getAllModules().subscribe(data => {
      this.modules = data
    });
    

    this.socketService.getMessage().subscribe((data:ManufacturingModule) => {
        console.log('Incoming msg', data);
        this.modules.push(data);
      });
    }


    onSubmit(method: Method) {
      let selectedParams = new Array<SelectedParameter>();
      // Create the selected parameters
      
      for (let i = 0; i < method.parameters.length; i++) {
        const param = method.parameters[i];
        const paramValue = this.parameterValues[i];
        
        selectedParams.push(new SelectedParameter(param, paramValue));
      }
      let executionDescription = new ServiceExecutionDescription(method.getFullPath(), method.getShortMethodType(), selectedParams);
      console.log(executionDescription);
      this.mfgServiceExecutor.executeService(executionDescription)
    }

  disconnectModule(moduleId) {
    // TODO: Post to API to really delete element
    this.httpClient.delete(`api/modules/${moduleId}`).subscribe(
      data => {this.removeModuleCard(moduleId)}),
      error => console.log('An error happened, module could not be disconnected'
    );    
  }

  removeModuleCard(moduleId) {
    // remove module with that id from the list
    for (let i = 0; i < this.modules.length; i++) {
      if (this.modules[i].name == moduleId) {
        this.modules.splice(i, 1);
        break;
      }      
    }
  }
}