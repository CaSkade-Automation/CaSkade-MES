import { Injectable } from '@angular/core';
import { ProductionModule } from '@shared/models/production-module/ProductionModule';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleService } from '../../shared/services/module.service';
import { D3GraphData, D3Link, D3Node } from './D3GraphData';
// import { containsElement } from '@angular/animations/browser/browser';


@Injectable({
    providedIn: 'root'
})
export class NodeCreatorService {
    apiRoot = "/api";
    modules: ProductionModule[]

    constructor(private moduleService: ModuleService) { }

    /** Creates node- and link-data with transmitted data of connected modules for d3.js visualization */
    getAllNodes(moduleIri: string): Observable<D3GraphData> {

        return this.moduleService.getAllModules().pipe(map(modules => {
            // If a module name is passed, filter the module list for that specific one
            if(moduleIri != undefined) {
                modules = modules.filter(module => module.iri == moduleIri);
            }
            return this.formatData(modules);
        }));
    }

    formatData(modules: ProductionModule[]): D3GraphData {

        const graphData = new D3GraphData();
        modules.forEach(module => {  //loop over all modules

            graphData.addNode(new D3Node(module.iri, module.getLocalName(), 1));                   // adds a node for each module

            module.skills.forEach(skill => {
                graphData.addNode(new D3Node(skill.iri, skill.getLocalName(), 100));
                graphData.addLink(new D3Link(module.iri, skill.iri, "hasSkill"));

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

            // Add module's capabilities
            module.capabilities.forEach(capability => { //loop over all capabilities of current module
                graphData.addNode(new D3Node(capability.iri, capability.getLocalName(), 200));
                graphData.addLink(new D3Link(module.iri, capability.iri, "hasCapability"));               // adds a link between capability and module

                capability.inputs.forEach(input => {
                    graphData.addNode(new D3Node(input.iri, input.getLocalName(), 240));
                    graphData.addLink(new D3Link(capability.iri, input.iri, "hasInput"));

                });

                capability.outputs.forEach(output => {
                    graphData.addNode(new D3Node(output.iri, output.getLocalName(), 270));
                    graphData.addLink(new D3Link(capability.iri, output.iri, "hasOutput"));
                });

            });

        });
        return graphData;
    }


}






