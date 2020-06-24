import { Component, OnInit } from '@angular/core';
import { SocketService } from "../../shared/services/socket.service";
import { HttpClient } from '@angular/common/http';
import { ServiceExecutionDescription, Method, SelectedParameter } from '../../shared/models/self-description';
import { ModuleService } from '../../shared/services/module.service';
import { ManufacturingServiceExecutor } from './manufacturing-service-executor.service';
import { ProductionModule } from '../../../../shared/models/production-module/ProductionModule';
import { Command } from '../../../../shared/models/command/Command';


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
    selectedSkill: any;
    selectedCapabilty: any;
    selectedModule: any;
    activeSkillCommands: any;
    skillCommands: any;
    commandName: string;
    executableCommands= new Array<Command>();
    //commandList: {name: string; iri: string; active: boolean};
 


    ngOnInit(): void {
        console.log("init");

        this.moduleService.getAllModules().subscribe((modules: ProductionModule[]) => {
            this.modules = modules;
            // console.log(this.modules[0].capabilities[0].skills[0].stateMachine.getActiveCommands());
        });

        // TODO (Aljosha): Fix socket service
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
        this.mfgServiceExecutor.executeService(executionDescription);
    }
    selectSkill(selectedModule, selectedCapability, newSelectedSkill): void{
        this.selectedSkill=newSelectedSkill;
        this.selectedModule=selectedModule;
        this.selectedCapabilty=selectedCapability;
        console.log(typeof(newSelectedSkill));
        
        /* console.log(this.selectedSkill);
        console.log(selectedModule);
        console.log(selectedCapability);*/
    
        this.modules.forEach(module => {
            if (selectedModule==module) {
                module.capabilities.forEach(capability => {
                    if(this.selectedCapabilty==capability){
                        capability.skills.forEach(skill => {
                         
                            if (newSelectedSkill==skill.getLocalName()) {
                                console.log(newSelectedSkill);
                             
                                const activeCommands=skill.stateMachine.getActiveCommands();
                                const allCommands=skill.stateMachine.getCommands();
                                this.addCommands(allCommands, activeCommands);
                                /*this.skillCommands=skill.stateMachine.getCommands();
                               
                                this.addCommands(this.activeSkillCommands);
                                this.skillCommands.forEach(command => {
                                    this.addCommands(command);
                                });
                               */
                            }
                            
                        });
                    }

                    
                });
                
            }
            
        });
        
       
    }
   
    addCommands(allCommands, activeCommands){
        this.executableCommands=[];
        let active=false;
        let group=1;
        allCommands.forEach(command => {
            //generating command-name
            let name= command.iri.split("#")[1];
            name=name.split("_")[0];

            //check if command ist active
            if (activeCommands.indexOf(command)==-1) {
                active=false;

                
            } else {
                active=true;
            }
            // group-assignment
            switch(name){
            case "Start":
                group=1; 
                break;
            case "Abort":
                group=4; 
                break;
            case "Hold":
                group=2; 
                break;
            case "Reset":
                group=3; 
                break;
            case "Stop":
                group=4; 
                break;
            case "Suspend":
                group=2; 
                break;case "Un-Hold":
                group=1; 
                break;case "Unsuspend":
                group=1; 
                break;
            }
            const  newCommand= new Command(name, command.iri, active, group);
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
