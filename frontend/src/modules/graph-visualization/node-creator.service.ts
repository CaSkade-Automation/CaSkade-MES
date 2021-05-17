import { Injectable } from '@angular/core';
import { Capability } from '@shared/models/capability/Capability';
import { ProductionModule } from '@shared/models/production-module/ProductionModule';
import { Skill } from '@shared/models/skill/Skill';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CapabilityService } from 'src/shared/services/capability.service';
import { SkillService } from 'src/shared/services/skill.service';
import { ModuleService } from '../../shared/services/module.service';
import { D3CapabilityNode, D3GraphData, D3Link, D3ModuleNode, D3Node, D3SkillNode, NodeType } from './D3GraphData';


@Injectable({
    providedIn: 'root'
})
export class NodeCreatorService {
    apiRoot = "/api";
    modules: ProductionModule[]

    constructor(
        private moduleService: ModuleService,
        private skillService: SkillService,
        private capabilityService: CapabilityService) { }

    // /** Creates node- and link-data with transmitted data of connected modules for d3.js visualization */
    // getAllNodes(moduleIri: string): Observable<D3GraphData> {

    //     return this.moduleService.getAllModules().pipe(map(modules => {
    //         // If a module name is passed, filter the module list for that specific one
    //         if(moduleIri != undefined) {
    //             modules = modules.filter(module => module.iri == moduleIri);
    //         }
    //         return this.getDataFromModules(modules);
    //     }));
    // }

    getAllModuleNodes(moduleIri: string): Observable<D3GraphData> {

        return this.moduleService.getAllModules().pipe(map(modules => {
            // If a module IRI is passed, filter the module list for that specific one
            if(moduleIri != undefined && moduleIri != "") {
                console.log("filtering");
                console.log("moduleIri: '" + moduleIri + "'");


                modules = modules.filter(module => module.iri == moduleIri);
            }

            console.log("modules");
            console.log(modules);



            const graphData = new D3GraphData();
            modules.forEach(module => {  //loop over all modules

                graphData.addNode(new D3ModuleNode(module.iri, module.getLocalName()));
                // TODO: Add module components

                const skillData = this.getDataFromSkills(module.skills);
                graphData.appendAndConnectData(skillData, module.iri, NodeType.D3SkillNode, "hasSkill");

                const capabilityData = this.getDataFromCapabilities(module.capabilities);
                graphData.appendAndConnectData(capabilityData, module.iri, NodeType.D3CapabilityNode, "hasCapability");
            });
            return graphData;

        }));
    }

    getAllSkillNodes(skillIri: string): Observable<D3GraphData> {
        return this.skillService.getAllSkills().pipe(map(skills => {
            // If a skill IRI is passed, filter the skill list for that specific one
            if(skillIri != undefined && skillIri != "") {
                skills = skills.filter(skill => skill.iri == skillIri);
            }

            return this.getDataFromSkills(skills);
        }));
    }

    getAllCapabilityNodes(capabilityIri: string): Observable<D3GraphData> {
        return this.capabilityService.getAllCapabilities().pipe(map(capabilities => {
            // If a capability IRI is passed, filter the capability list for that specific one
            if(capabilityIri != undefined && capabilityIri != "") {
                capabilities = capabilities.filter(capability => capability.iri == capabilityIri);
            }

            return this.getDataFromCapabilities(capabilities);
        }));
    }


    private getDataFromSkills(skills: Skill[]): D3GraphData {
        const graphData = new D3GraphData();
        skills.forEach(skill => {

            graphData.addNode(new D3SkillNode(skill.iri, skill.getLocalName()));

            // Add state machine
            graphData.addNode(new D3Node(skill.stateMachine.iri, skill.stateMachine.getLocalName(), 120));
            graphData.addLink(new D3Link(skill.iri, skill.stateMachine.iri, "hasStateMachine"));

            // Add skill parameters
            skill.skillParameters.forEach(parameter => {
                graphData.addNode(new D3Node(parameter.iri, parameter.getLocalName(), 140));
                graphData.addLink(new D3Link(skill.iri, parameter.iri, "hasSkillParameter"));
            });

            // Add skill outputs
            skill.skillOutputs.forEach(output => {
                graphData.addNode(new D3Node(output.iri,output.getLocalName(), 160));
                graphData.addLink(new D3Link(skill.iri, output.iri, "hasSkillOutput"));
            });
        });
        return graphData;
    }

    private getDataFromCapabilities(capabilities: Capability[]): D3GraphData {
        const graphData = new D3GraphData();

        capabilities.forEach(capability => { //loop over all capabilities of current module
            graphData.addNode(new D3CapabilityNode(capability.iri, capability.getLocalName()));

            capability.inputs.forEach(input => {
                graphData.addNode(new D3Node(input.iri, input.getLocalName(), 240));
                graphData.addLink(new D3Link(capability.iri, input.iri, "hasInput"));

            });

            capability.outputs.forEach(output => {
                graphData.addNode(new D3Node(output.iri, output.getLocalName(), 270));
                graphData.addLink(new D3Link(capability.iri, output.iri, "hasOutput"));
            });
        });
        return graphData;
    }




}







