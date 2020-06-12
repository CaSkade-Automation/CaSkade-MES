import { Component, OnInit } from '@angular/core';
import { SocketService } from "../../shared/services/socket.service";
import { HttpClient } from '@angular/common/http';
import { ServiceExecutionDescription, Method, SelectedParameter } from '../../shared/models/self-description';
import { ModuleService } from '../../shared/services/module.service';
import { ManufacturingServiceExecutor } from './manufacturing-service-executor.service';
import { ProductionModule } from '../../../../shared/models/production-module/ProductionModule';
import { take } from 'rxjs/operators';

@Component({
    selector: 'module-management',
    templateUrl: 'module-management.component.html',
})
export class ModuleManagementComponent implements OnInit {

    constructor(private httpClient: HttpClient,
        private socketService: SocketService,
        private moduleService: ModuleService,
        private mfgServiceExecutor: ManufacturingServiceExecutor) { }

    incomingmsg = [];
    modules = new Array<ProductionModule>();
    serviceExecutionDescription: ServiceExecutionDescription;
    parameterValues = new Array<string>();

    ngOnInit(): void {
        console.log("init");

        this.modules = this.moduleService.getAllModulesWithCapabilitiesAndSkills();

        // this.moduleService.getAllModules().subscribe(productionModules => {
        //     console.log(productionModules);

        //     this.modules = productionModules;
        //     this.modules.forEach(manufacturingModule => {
        //         this.moduleService.getAllCapabilitiesOfModule(manufacturingModule.iri).subscribe(moduleProcesses => {
        //             manufacturingModule.addCapabilities(moduleProcesses);
        //         });
        //     });

        // });

        // this.socketService.getMessage().subscribe(msg => {
        //     this.moduleService.getAllModules().subscribe(data => {
        //         const currentModules: Array<ProductionModule> = data;
        //         this.modules = currentModules;
        //         this.modules.forEach(manufacturingModule => {
        //             this.moduleService.getAllCapabilitiesOfModule(manufacturingModule.iri).subscribe(moduleProcesses => {
        //                 manufacturingModule.addCapabilities(moduleProcesses);
        //             });
        //         });
        //     });
        // });
    }

    sendMsg(msg) {
        this.socketService.sendMessage(msg);
    }


    executeModuleService(method: Method) {
        const selectedParams = new Array<SelectedParameter>();

        // Create the selected parameters
        for (let i = 0; i < method.parameters.length; i++) {
            const param = method.parameters[i];
            const paramValue = this.parameterValues[i];

            selectedParams.push(new SelectedParameter(param, paramValue));
        }
        const executionDescription = new ServiceExecutionDescription(method.getFullPath(), method.getShortMethodType(), selectedParams);
        this.mfgServiceExecutor.executeService(executionDescription);
    }


    /**
     * Compares the existing modules-array with a new new list of all currently connected modules, finds out which modules are new and adds them to the modules-array
     * @param newModule Array of all modules that are currently connected
     */
    addNewModules(newModule: ProductionModule): void {
        // Add the new module
        this.modules.push(newModule);
    }




    disconnectModule(moduleIri) {
        // TODO: Post to API to really delete element
        this.httpClient.delete(`api/modules/${moduleIri}`).subscribe(
            data => {this.removeModuleCard(moduleIri);}),
        error => console.log('An error happened, module could not be disconnected'
        );
    }

    removeModuleCard(moduleIri) {
        // remove module with that id from the list
        for (let i = 0; i < this.modules.length; i++) {
            if (this.modules[i].iri == moduleIri) {
                this.modules.splice(i, 1);
                break;
            }
        }
    }
}
