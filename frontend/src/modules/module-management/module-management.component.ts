import { Component, OnInit } from '@angular/core';
import { SocketService } from "../../shared/services/socket.service";
import { HttpClient } from '@angular/common/http';
import { ServiceExecutionDescription, Method, SelectedParameter } from '../../shared/models/self-description';
import { ModuleService } from '../../shared/services/module.service';
import { SkillExecutor as SkillExecutor } from '../../shared/services/skill-execution.service';
import { ProductionModule } from '@shared/models/production-module/ProductionModule';
import { Command } from '@shared/models/command/Command';
import { Transition } from '@shared/models/state-machine/Transition';
import { Skill } from '@shared/models/skill/Skill';
import { SocketEventName } from '@shared/socket-communication/SocketEventName';
import { take } from 'rxjs/operators';


@Component({
    selector: 'module-management',
    styleUrls:['module-management.scss'],
    templateUrl: 'module-management.component.html',
})
export class ModuleManagementComponent implements OnInit {

    constructor(private httpClient: HttpClient,
        private socketService: SocketService,
        private moduleService: ModuleService,
        private skillExecutor: SkillExecutor) { }

    incomingmsg = [];
    modules = new Array<ProductionModule>();
    serviceExecutionDescription: ServiceExecutionDescription;
    parameterValues = new Array<string>();
    selectedSkill: any;
    selectedCapabilty: any;
    selectedModule: any;
    activeSkillCommands: any;
    skillCommands: any;
    commandName: string;
    executableCommands = new Array<Command>();
    //commandList: {name: string; iri: string; active: boolean};



    ngOnInit(): void {
        console.log("init");

        this.moduleService.getAllModules().subscribe((modules: ProductionModule[]) => {
            this.modules = modules;
        });

        //TODO Socket service could be used better if we could get the new module from the socket server
        this.socketService.getMessage(SocketEventName.ProductionModules_Added).subscribe(msg => {
            const modules = this.moduleService.getAllModules().pipe(take(1)).subscribe(newModules => {
                this.addNewModules(newModules);
            });

            // this.moduleService.getAllModules().subscribe((newModules: ProductionModule[]) => {
            //     this.addNewModules(newModules);
            //     // this.modules.forEach(manufacturingModule => {
            //     //     this.moduleService.getAllCapabilitiesOfModule(manufacturingModule.iri).subscribe(moduleProcesses => {
            //     //         manufacturingModule.addCapabilities(moduleProcesses);
            //     //     });
            //     // });
            // });
        });
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


    executeModuleService(method: Method) {
        const selectedParams = new Array<SelectedParameter>();

        // Create the selected parameters
        for (let i = 0; i < method.parameters.length; i++) {
            const param = method.parameters[i];
            const paramValue = this.parameterValues[i];

            selectedParams.push(new SelectedParameter(param, paramValue));
        }
        const executionDescription = new ServiceExecutionDescription(method.getFullPath(), method.getShortMethodType(), selectedParams);
        this.skillExecutor.executeService(executionDescription);
    }

    getCommandButtonClass(command: Transition) {
        const commandName = command.getLocalName();
        switch (commandName) {
        case "Start_Command":
        case "Un-Hold_Command":
        case "Unsuspend_Command":
        case "Reset_Command":
            return "btn-success";
        case "Clear_Command":
            return "btn-secondary";
        case "Suspend_Command":
        case "Hold_Command":
            return "btn-dark";
        case "Abort_Command":
        case "Stop_Command":
            return "btn-danger";
        }
    }

    isActiveCommand(currentCommand: Transition, skill: Skill) {
        return skill.stateMachine.getActiveCommands().some(command => command.iri == currentCommand.iri);
    }


    selectSkill(selectedModule, selectedCapability, newSelectedSkill): void {
        this.selectedSkill = newSelectedSkill;
        this.selectedModule = selectedModule;
        this.selectedCapabilty = selectedCapability;
        console.log(typeof (newSelectedSkill));

        /* console.log(this.selectedSkill);
        console.log(selectedModule);
        console.log(selectedCapability);*/

        this.modules.forEach(module => {
            module.skills.forEach(skill => {

                if (newSelectedSkill == skill.getLocalName()) {
                    console.log(newSelectedSkill);

                    const activeCommands = skill.stateMachine.getActiveCommands();
                    const allCommands = skill.stateMachine.getCommands();
                    this.addCommands(allCommands, activeCommands);
                    /*this.skillCommands=skill.stateMachine.getCommands();

                    this.addCommands(this.activeSkillCommands);
                    this.skillCommands.forEach(command => {
                        this.addCommands(command);
                    });
                   */
                }

            });
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

    getShortName(command: Transition): string{
        let name = command.iri.split("#")[1];
        name = name.split("_")[0];
        return name;
    }




    disconnectModule(moduleIri) {
        // TODO: Post to API to really delete element
        this.httpClient.delete(`api/modules/${moduleIri}`).subscribe(
            data => { this.removeModuleCard(moduleIri); }),
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
