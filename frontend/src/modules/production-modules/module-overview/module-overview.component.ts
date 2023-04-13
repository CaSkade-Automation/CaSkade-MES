import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModuleService } from '../../../shared/services/module.service';
import { Command } from '@shared/models/state-machine/Command';
import { Subscription } from 'rxjs';
import { ProductionModule } from '../../../shared/models/ProductionModule';

@Component({
    selector: 'app-module-overview',
    templateUrl: './module-overview.component.html',

})
export class ModuleOverviewComponent implements OnInit {

    constructor(
        private httpClient: HttpClient,
        private moduleService: ModuleService,
    ) { }

    incomingmsg = [];
    modules = new Array<ProductionModule>();
    parameterValues = new Array<string>();
    selectedSkill: any;
    selectedCapabilty: any;
    selectedModule: any;
    activeSkillCommands: any;
    skillCommands: any;
    commandName: string;
    executableCommands = new Array<Command>();
    //commandList: {name: string; iri: string; active: boolean};
    moduleSubscription: Subscription;


    ngOnInit(): void {
        this.moduleSubscription = this.moduleService.getAllModules().subscribe((modules: ProductionModule[]) => {
            this.modules = modules;
        });
    }

    /**
     * Compares the existing modules-array with a new new list of all currently connected modules, finds out which modules are new and adds them to the modules-array
     * @param newModule Array of all modules that are currently connected
     */
    addNewModules(newModules: ProductionModule[]): void {
        newModules.forEach(module => {
            if (!this.modules.some(currentModule => currentModule.iri == module.iri)) {
                this.modules.push(module);
            }
        });
    }


    onCapabilityDeleted(capabilityIri: string): void {
        // find module with that capability
        let capabilityIndex: number;
        const module = this.modules.find(module => capabilityIndex = module.capabilities.findIndex(capability => capability.iri == capabilityIri));
        module.capabilities.splice(capabilityIndex, 1);
    }



    deleteModule(moduleIri): void {
        const encodedModuleIri = encodeURIComponent(moduleIri);
        console.log(encodedModuleIri);

        this.httpClient.delete(`api/modules/${encodedModuleIri}`).subscribe({
            complete: () => this.handleModuleDeleted(moduleIri),
            error: (err) => {console.log(`Module could not be deleted, error: ${err}`);},
        });}


    handleModuleDeleted(moduleIri): void {
        // remove module with that id from the list
        const moduleIndex = this.modules.findIndex(module => module.iri == moduleIri);
        this.modules.splice(moduleIndex, 1);
    }

    ngOnDestroy(): void {
        this.moduleSubscription.unsubscribe();
    }
}
