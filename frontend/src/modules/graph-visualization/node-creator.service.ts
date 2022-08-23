import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ModuleService } from '../../shared/services/module.service';
import { D3CapabilityNode, D3InputNode, D3Link, D3ModuleNode, D3Node, D3OutputNode, D3SkillNode, NodeType } from './D3GraphData';

@Injectable({
    providedIn: 'root'
})
export class NodeCreatorService {
    apiRoot = "/api";

    constructor(
        private moduleService: ModuleService
    ) {}

    getAllNodes(): Observable<{links: D3Link[]; nodes: D3Node[] }> {
        console.log("getting all nodes");

        // const receivedData = await (lastValueFrom(this.moduleService.getAllModules()));
        const $receivedData$ = this.moduleService.getAllModules();

        const nodeData= {nodes:[], links:[]};
        const id=0;                            // ID start value
        return $receivedData$.pipe(map(data => {
            data.forEach(receivedModule => {  //loop over all modules
                const moduleNode = new D3ModuleNode(receivedModule.iri, receivedModule.getLocalName());
                nodeData.nodes.push(moduleNode);

                receivedModule.capabilities.forEach(capability=>{ //loop over all capabilities of current module
                    const capNode = new D3CapabilityNode(capability.iri, capability.getLocalName());
                    nodeData.nodes.push(capNode);
                    nodeData.links.push(new D3Link(moduleNode, capNode, "hasCapability"));

                    capability.inputs.forEach(input=>{
                        const inputNode = new D3InputNode(input.iri, input.getLocalName());
                        nodeData.nodes.push(inputNode);
                        nodeData.links.push(new D3Link(capNode, inputNode, "hasInput"));

                        const inputTypeNode = new D3Node(input.type, input.type, NodeType.None);
                        nodeData.nodes.push(inputTypeNode);
                        nodeData.links.push(new D3Link(inputNode, inputTypeNode, "rdf:type"));
                    });

                    capability.outputs.forEach(output=>{
                        const outputNode = new D3OutputNode(output.iri, output.getLocalName());
                        nodeData.nodes.push(outputNode);
                        nodeData.links.push(new D3Link(capNode, outputNode, "hasInput"));

                        const outputTypeNode = new D3Node(output.type, output.type, NodeType.None);
                        nodeData.nodes.push(outputTypeNode);
                        nodeData.links.push(new D3Link(outputNode, outputTypeNode, "rdf:type"));
                    });

                    capability.skills.forEach(skill=>{
                        const skillNode = new D3SkillNode(skill.iri, skill.getLocalName());
                        nodeData.nodes.push(skillNode);
                        nodeData.links.push(new D3Link(capNode, skillNode, "executable_via_Skill"));
                    });

                });

            });

            return nodeData;
        }));
    }


}






