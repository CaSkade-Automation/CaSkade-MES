import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModuleService } from '../../../shared/services/module.service';
import { Command } from '@shared/models/command/Command';
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


    addCommands(allCommands, activeCommands) {
        this.executableCommands = [];
        let active = false;
        let group = 1;
        allCommands.forEach(command => {
            //generating command-name
            let name = command.iri.split("#")[1];
            name = name.split("_")[0];

            //check if command ist active
            if (activeCommands.indexOf(command) == -1) {
                active = false;


            } else {
                active = true;
            }
            // group-assignment
            switch (name) {
            case "Start":
                group = 1;
                break;
            case "Abort":
                group = 4;
                break;
            case "Hold":
                group = 2;
                break;
            case "Reset":
                group = 3;
                break;
            case "Stop":
                group = 4;
                break;
            case "Suspend":
                group = 2;
                break;
            case "Un-Hold":
                group = 1;
                break;
            case "Unsuspend":
                group = 1;
                break;
            }
            const newCommand = new Command(name, command.iri, active, group);
            console.log(newCommand);
            this.executableCommands.push(newCommand);
        });

        /* allCommands.forEach(command => {
            if (activeCommands.includes(command)) {

            } else {

            }
        });*/

        /*let name= command.iri.split("#")[1];
        name=name.split("_",1);
        console.log('iri ist: '+ command.iri);
        console.log('Der Name ist:'+name);
       */

        //const commandName=commandIris.split('#')[1];

        // commandName= commandName.split('#',1);

        //return commandName;
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
    /*getShortName(command: Transition): string{
        let name = command.iri.split("#")[1];
        name = name.split("_")[0];
        return name;
    }*/

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
