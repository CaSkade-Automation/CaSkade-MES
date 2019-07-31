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
    this.moduleManagementService.getAllModules().subscribe(manufacturingModules => {
      this.modules = manufacturingModules;
      this.modules.forEach(manufacturingModule => {
        this.moduleManagementService.getAllProcessesOfModule(manufacturingModule.name).subscribe(moduleProcesses => {
          manufacturingModule.addProcesses(moduleProcesses);
        });
      });
      
    });
    
    this.socketService.getMessage().subscribe(msg => {
      this.moduleManagementService.getAllModules().subscribe(data => {
        const currentModules: Array<ManufacturingModule> = data;
        this.addNewModules(currentModules);
        this.modules.forEach(manufacturingModule => {
          this.moduleManagementService.getAllProcessesOfModule(manufacturingModule.name).subscribe(moduleProcesses => {
            manufacturingModule.addProcesses(moduleProcesses);
          });
        });
      });
    });
  }

  sendMsg(msg) {
    this.socketService.sendMessage(msg);
 }


  executeModuleService(method: Method) {
    let selectedParams = new Array<SelectedParameter>();
    
    // Create the selected parameters
    for (let i = 0; i < method.parameters.length; i++) {
      const param = method.parameters[i];
      const paramValue = this.parameterValues[i];
      
      selectedParams.push(new SelectedParameter(param, paramValue));
    }
    let executionDescription = new ServiceExecutionDescription(method.getFullPath(), method.getShortMethodType(), selectedParams);
    this.mfgServiceExecutor.executeService(executionDescription)
  }


  /**
   * Compares the existing modules-array with a new new list of all currently connected modules, finds out which modules are new and adds them to the modules-array
   * @param newModules Array of all modules that are currently connected
   */
  addNewModules(newModules: Array<ManufacturingModule>): ManufacturingModule{
    // Get only the modules that are not already displayed
    if(this.modules.length != newModules.length) {
      this.modules.forEach(module => {
        for (let i = 0; i < newModules.length; i++) {
          const newModule = newModules[i];
          if(module.equals(newModule)) {
            newModules.splice(i, 1);
          }
        }
      });

    // Add the new modules
    newModules.forEach(newModule => {
      this.modules.push(newModule);
    });
    } else{
      // same length -> no new module
      return null;
    }
  }




  // disconnectModule(moduleId) {
  //   // TODO: Post to API to really delete element
  //   this.httpClient.delete(`api/modules/${moduleId}`).subscribe(
  //     data => {this.removeModuleCard(moduleId)}),
  //     error => console.log('An error happened, module could not be disconnected'
  //   );    
  // }

  // removeModuleCard(moduleId) {
  //   // remove module with that id from the list
  //   for (let i = 0; i < this.modules.length; i++) {
  //     if (this.modules[i].name == moduleId) {
  //       this.modules.splice(i, 1);
  //       break;
  //     }      
  //   }
  // }
}