import { Injectable } from '@angular/core';
import { lastValueFrom, map, Observable } from 'rxjs';
import { ModuleService } from '../../shared/services/module.service';
import * as d3Force from 'd3-force';
import { D3Link, D3Node } from './D3GraphData';

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
        console.log("received data");
        console.log($receivedData$);


        const nodeData= {nodes:[], links:[]};
        const idMap= new Map();                 // Map for saving Node-IDs
        let id=0;                            // ID start value
        return $receivedData$.pipe(map(data => {
            data.forEach(receivedModule => {  //loop over all modules
                id++;
                idMap.set(receivedModule, id);        // assigns an ID for each module-node
                nodeData.nodes.push({                     // adds a node for each module
                    "id" : idMap.get(receivedModule),
                    "name": receivedModule.getLocalName(),
                    "group": 1                            // assings node-groups (here: node colour)
                });

                receivedModule.capabilities.forEach(capability=>{ //loop over all capabilities of current module
                    id++;
                    idMap.set(capability, id);          // assigns an ID for each capability-node
                    nodeData.nodes.push({                   // adds a node for each capability of current module
                        "id" : idMap.get(capability),
                        "name": capability.getLocalName(),
                        "group": 2
                    });
                    nodeData.links.push({                   // adds a link between capability and module
                        "source": idMap.get(receivedModule),    // defines source and target of the link. Important for the direction of the link/arrow
                        "target": idMap.get(capability),
                        "type": "has_capability"            // adds a link description
                    });

                    capability.inputs.forEach(input=>{
                        id++;
                        idMap.set(input, id);             // assigns an ID for each input-node
                        nodeData.nodes.push({                 // adds a node for each input of current capability
                            "id": idMap.get(input),
                            "name": input.getLocalName(),
                            "group": 3
                        });
                        nodeData.links.push({                 // adds a link between capability and input
                            "source": idMap.get(capability),
                            "target": idMap.get(input),
                            "type": "has_input"
                        });
                        id++;
                        nodeData.nodes.push({                 // adds a node for rdf:type of current input
                            "id": id,                         // adds an ID for the type node (not saved in idMap)
                            "name": input.type,
                            "group": 6
                        });
                        nodeData.links.push({                 // adds a link between rdf:type and input
                            "source": idMap.get(input),
                            "target": id,                     //assigns an ID for each type-node (not saved in idMap)
                            "type": "rdf:type"
                        });
                    });

                    capability.outputs.forEach(output=>{
                        id++;
                        idMap.set(output,id);             // assigns an ID for each output-node
                        nodeData.nodes.push({                 // adds a node for each output of current capability
                            "id" : idMap.get(output),
                            "name": output.getLocalName(),
                            "group": 4
                        });
                        nodeData.links.push({                 // adds a link between capability and output
                            "source": idMap.get(capability),
                            "target": idMap.get(output),
                            "type": "has_output"
                        });
                        id++;
                        nodeData.nodes.push({                 // adds a node for rdf:type of current output
                            "id": id,
                            "name": output.type,
                            "group": 6
                        });
                        nodeData.links.push({                 // adds a link between rdf:type and input
                            "source": idMap.get(output),
                            "target": id,
                            "type": "rdf:type"
                        });
                    });

                    capability.skills.forEach(skill=>{
                        id++;
                        idMap.set(skill, id);              // adds a node for each skill of current capability
                        nodeData.nodes.push({
                            "id" : idMap.get(skill),
                            "name": skill.getLocalName(),
                            "group": 5
                        });
                        nodeData.links.push({                // adds a link between  current capability and current skill node
                            "source": idMap.get(capability),
                            "target": idMap.get(skill),
                            "type": "executable_via_Skill"
                        });
                    });

                });

            });

            return nodeData;
        }));
    }


}






