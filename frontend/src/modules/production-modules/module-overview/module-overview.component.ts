import { Component, OnInit } from '@angular/core';
import { SocketService } from "../../../shared/services/socket.service";
import { HttpClient } from '@angular/common/http';
import { ModuleService } from '../../../shared/services/module.service';
import { ProductionModule } from '@shared/models/production-module/ProductionModule';
import { Command } from '@shared/models/command/Command';
import { Transition } from '@shared/models/state-machine/Transition';
import { Skill } from '@shared/models/skill/Skill';
import { SocketEventName } from '@shared/socket-communication/SocketEventName';
import { take } from 'rxjs/operators';
import { SkillExecutionService } from 'src/shared/services/skill-execution.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-module-overview',
    templateUrl: './module-overview.component.html',

})
export class ModuleOverviewComponent implements OnInit {

    constructor(private httpClient: HttpClient,
        private socketService: SocketService,
        private moduleService: ModuleService,
        private skillExecutionService: SkillExecutionService) { }

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
        console.log("init");

        this.moduleSubscription = this.moduleService.getAllModules().subscribe((modules: ProductionModule[]) => {
            this.modules = modules;
        });

        //TODO Socket service could be used better if we could get the new module from the socket server
        // this.socketService.getMessage(SocketEventName.ProductionModules_Added).subscribe(msg => {
        //     const modules = this.moduleService.getAllModules().pipe(take(1)).subscribe(newModules => {
        //         this.addNewModules(newModules);
        //     });
        // });
    }
    /*executableCommands=[
        {id:"1", name:"Start", group:"1"},
        {id:"2",name:"Hold", group:"2"},
        {id:"3",name:"Unhold", group:"1"},
        {id:"4",name:"Suspend", group:"2"},
        {id:"5",name:"Unsuspend", group:"1"},
        {id:"6",name:"Reset", group:"3"},
        {id:"7",name:"Abort", group:"4"},
        {id:"8",name:"Clear", group:"3"},
        {id:"9",name:"Stop", group:"4"}
    ]*/

    sendMsg(msg) {
        this.socketService.sendMessage(msg);
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
                break; case "Un-Hold":
                group = 1;
                break; case "Unsuspend":
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




    deleteModule(moduleIri) {
        const encodedModuleIri = encodeURIComponent(moduleIri);
        console.log(encodedModuleIri);

        this.httpClient.delete(`api/modules/${encodedModuleIri}`).subscribe(
            error => console.log(`Module could not be deleted, error: ${error}`),
            complete => this.removeModuleCard(moduleIri)

            // next => console.log("next value"),
            // error => {this.removeModuleCard(moduleIri); });
            // complete => {console.log('An error happened, module could not be deleted');};
        );}

    removeModuleCard(moduleIri) {
        console.log("removing module card");

        // remove module with that id from the list
        const moduleIndex = this.modules.findIndex(module => module.iri == moduleIri);
        this.modules.splice(moduleIndex, 1);
    }

    ngOnDestroy(): void {
        this.moduleSubscription.unsubscribe();
    }
}
