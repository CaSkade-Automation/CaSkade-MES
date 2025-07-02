import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BpmnModelerComponent } from '../../../shared/modules/bpmn-modeler/bpmn-modeler.component';
import { ProcessPlanningService } from '../../../shared/services/process-planning.service';
import { PlanningResultDto } from '@shared/models/process-planning/PlanningResult';
import { RdfElement } from '../../../../../shared/src/models/RdfElement';
import * as BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';

class Position {
    constructor(
        public x: number,
        public y: number
    ){}
}


// const dummyProcess = {
//     "plan": {
//         "plan_length": 2,
//         "plan_steps": [
//             {
//                 "capability_applications": [
//                     {
//                         "capability_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-driveTo19",
//                         "inputs": [
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-driveTo19/RequiredInflat/latitude71_de",
//                                 "value": 53.56687
//                             },
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-driveTo19/RequiredInflong/longitude70_de",
//                                 "value": 10.11041
//                             }
//                         ],
//                         "outputs": [
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/latitude_de",
//                                 "value": 53.56687
//                             },
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/longitude_de",
//                                 "value": 10.11041
//                             }
//                         ]
//                     },
//                     {
//                         "capability_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Dummy/justChill1",
//                         "inputs": [
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-driveTo19/RequiredInflat/latitude71_de",
//                                 "value": 53.56687
//                             },
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-driveTo19/RequiredInflong/longitude70_de",
//                                 "value": 10.11041
//                             }
//                         ],
//                         "outputs": [
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/latitude_de",
//                                 "value": 53.56687
//                             },
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/longitude_de",
//                                 "value": 10.11041
//                             }
//                         ]
//                     },
//                     {
//                         "capability_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Dummy/justChill2",
//                         "inputs": [
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-driveTo19/RequiredInflat/latitude71_de",
//                                 "value": 53.56687
//                             },
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-driveTo19/RequiredInflong/longitude70_de",
//                                 "value": 10.11041
//                             }
//                         ],
//                         "outputs": [
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/latitude_de",
//                                 "value": 53.56687
//                             },
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/longitude_de",
//                                 "value": 10.11041
//                             }
//                         ]
//                     },
//                     {
//                         "capability_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Dummy/justChill3",
//                         "inputs": [
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-driveTo19/RequiredInflat/latitude71_de",
//                                 "value": 53.56687
//                             },
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-driveTo19/RequiredInflong/longitude70_de",
//                                 "value": 10.11041
//                             }
//                         ],
//                         "outputs": [
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/latitude_de",
//                                 "value": 53.56687
//                             },
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/longitude_de",
//                                 "value": 10.11041
//                             }
//                         ]
//                     }
//                 ],
//                 "duration": 0,
//                 "step_number": 0
//             },
//             {
//                 "capability_applications": [
//                     {
//                         "capability_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-grab34",
//                         "inputs": [
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-grab34/RequiredProdItem/grabbed162_de",
//                                 "value": false
//                             },
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-grab34/RequiredProdItem/latitude_de",
//                                 "value": 53.56687
//                             },
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-grab34/RequiredProdItem/longitude_de",
//                                 "value": 10.11041
//                             }
//                         ],
//                         "outputs": [
//                             {
//                                 "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-grab34/AssuranceProdItem/grabbed162_de",
//                                 "value": true
//                             }
//                         ]
//                     }
//                 ],
//                 "duration": 0,
//                 "step_number": 1
//             }
//         ],
//         "total_duration": 0
//     },
//     "time_created": "2023-12-12 15:26:10.344486"
// };




@Component({
    selector: 'bpmn-result',
    templateUrl: 'bpmn-result.component.html',
})
export class BpmnPlanningResultComponent implements OnInit, AfterViewInit {

    readonly GATEWAY_HEIGHT = 36;
    readonly TASK_HEIGHT = 72;

    @ViewChild('bpmnModeler') bpmnModelerElement: BpmnModelerComponent;
    bpmnModeler: BpmnModeler;
    plan: PlanningResultDto
    process: any
    modeling: any
    elementRegistry: any;
    elementFactory: any

    constructor(
        private planningService: ProcessPlanningService,
    ) {}


    ngOnInit(): void {
        this.plan = this.planningService.currentResult;
    }


    ngAfterViewInit(): void {
        this.bpmnModeler = this.bpmnModelerElement.bpmnModeler;
        this.bpmnModelerElement.clear().then(() => this.convertPlanToBpmn());
    }

    convertPlanToBpmn(): void {
        if(!this.plan) return;

        this.process = this.bpmnModeler. get('canvas').getRootElement();
        this.modeling = this.bpmnModeler.get('modeling');
        this.elementRegistry = this.bpmnModeler.get('elementRegistry');
        this.elementFactory = this.bpmnModeler.get('elementFactory');
        // Get the first element
        const startEvent = this.elementRegistry.find(e => e.type == 'bpmn:StartEvent');
        console.log(startEvent);

        // const elements = new Array<any>();
        const groups = new Array<Array<any>>();
        groups.push([startEvent]);
        // elements.push(startEvent);

        // let lastElement = startEvent;
        this.plan.plan.plan_steps.forEach(step => {
            // Open a parallel flow if there are multiple capabilities
            let lastElement = groups.at(-1)[0];
            if (step.capability_applications.length > 1) {
                const newPosition = new Position((lastElement.x + lastElement.width) +100, (lastElement.y + (this.GATEWAY_HEIGHT/2)));
                const gateway = this.createParallelGateway(newPosition);
                this.modeling.connect(lastElement, gateway, {
                    type: 'bpmn:SequenceFlow'
                });
                lastElement = gateway;
                groups.push([gateway]);
            }

            const group = [];
            let i = 1;
            let coefficient = -1;
            step.capability_applications.forEach(capabilityApplication => {
                const x = lastElement.x + lastElement.width + 100;
                // calculate y by adding / substracting a margin
                const correction = ((this.TASK_HEIGHT-this.GATEWAY_HEIGHT) / 2); //;* (step.capability_applications.length - i +1) * coefficient;
                const baseY = startEvent.y;
                const margin = 30 * (step.capability_applications.length - 1) * (Math.floor((i+1)/2)) * coefficient;
                const y = baseY + correction + margin;

                const iri = new RdfElement(capabilityApplication.capability_iri);
                const name = iri.getLocalName();
                const newPosition = new Position(x, y);
                const task = this.createServiceTask(name, newPosition);
                this.modeling.connect(lastElement, task, {
                    type: 'bpmn:SequenceFlow'
                });
                group.push(task);
                i++;
                coefficient = coefficient * -1;
                // elements.push(task);
            });
            groups.push(group);
            // elements.push(group);
            // lastElement = group;


            // Close the parallel flow
            if (step.capability_applications.length > 1) {
                const parallelEndX = group[0].x + group[0].width + 100;
                const parallelEndY = startEvent.y + (this.GATEWAY_HEIGHT/2);
                const newPosition = new Position(parallelEndX, parallelEndY);
                const gateway = this.createParallelGateway(newPosition);
                group.forEach(element => {
                    this.modeling.connect(element, gateway, {
                        type: 'bpmn:SequenceFlow'
                    });
                });
                lastElement = gateway;
                groups.push([gateway]);
            }

        });

        // Get last element out of the group
        const lastElement = groups.at(-1)[0];

        // In the end, add an end event
        const newPosition = new Position((lastElement.x + lastElement.width) +100, (startEvent.y + 18));
        const endEvent = this.createEndEvent(newPosition);
        this.modeling.connect(lastElement, endEvent, {
            type: 'bpmn:SequenceFlow'
        });
        groups.push([endEvent]);
    }


    private createEndEvent(elementPosition: Position): any {
        return this.createElement(elementPosition, 'bpmn:EndEvent');
    }

    private createServiceTask(elementName: string, elementPosition: Position): any {
        return this.createElement(elementPosition, 'bpmn:ServiceTask', elementName);
    }

    private createParallelGateway(elementPosition: Position): any {
        return this.createElement(elementPosition, 'bpmn:ParallelGateway');
    }

    /**
     * Creates a BPMN element of a given type at a certain position and with a defined name
     * @param elementPosition
     * @param elementType
     * @param elementName
     * @returns
     */
    private createElement(elementPosition: Position, elementType: string, elementName = ""): any {
        const element = this.elementFactory.createShape({
            type: elementType,
        });

        const position = {
            x: elementPosition.x,
            y: elementPosition.y
        };

        this.modeling.createShape(element, position, this.process);

        this.modeling.updateProperties(element, {
            name: elementName
        });
        return element;
    }

}
