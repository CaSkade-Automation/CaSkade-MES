import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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





const dummyProcess = {
    "plan": {
        "plan_length": 2,
        "plan_steps": [
            {
                "capability_applications": [
                    {
                        "capability_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-driveTo19",
                        "inputs": [
                            {
                                "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-driveTo19/RequiredInflat/latitude71_de",
                                "value": 53.56687
                            },
                            {
                                "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-driveTo19/RequiredInflong/longitude70_de",
                                "value": 10.11041
                            }
                        ],
                        "outputs": [
                            {
                                "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/latitude_de",
                                "value": 53.56687
                            },
                            {
                                "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/longitude_de",
                                "value": 10.11041
                            }
                        ]
                    }
                ],
                "duration": 0,
                "step_number": 0
            },
            {
                "capability_applications": [
                    {
                        "capability_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-grab34",
                        "inputs": [
                            {
                                "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-grab34/RequiredProdItem/grabbed162_de",
                                "value": false
                            },
                            {
                                "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-grab34/RequiredProdItem/latitude_de",
                                "value": 53.56687
                            },
                            {
                                "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-grab34/RequiredProdItem/longitude_de",
                                "value": 10.11041
                            }
                        ],
                        "outputs": [
                            {
                                "property_iri": "http://www.hsu-hh.de/aut/RIVA/Logistic#Rover7/cap-grab34/AssuranceProdItem/grabbed162_de",
                                "value": true
                            }
                        ]
                    }
                ],
                "duration": 0,
                "step_number": 1
            }
        ],
        "total_duration": 0
    },
    "time_created": "2023-12-12 15:26:10.344486"
};




@Component({
    selector: 'bpmn-result',
    templateUrl: 'bpmn-result.component.html',
})
export class BpmnPlanningResultComponent implements OnInit, AfterViewInit, AfterContentInit {

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
        this.plan = this.planningService.currentPlan;

    }

    ngAfterContentInit(): void {
        console.log("after content init");

    }

    ngAfterViewInit(): void {
        console.log("after view checked");
        this.bpmnModeler = this.bpmnModelerElement.bpmnModeler;

        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.

        // Setup all BPMN components

        this.bpmnModelerElement.clear();



        setTimeout(() => this.convertPlanToBpmn(), 200);

    }

    convertPlanToBpmn(){
        if(!this.plan) return;
        this.process = this.bpmnModeler. get('canvas').getRootElement();
        this.modeling = this.bpmnModeler.get('modeling');
        this.elementRegistry = this.bpmnModeler.get('elementRegistry');
        this.elementFactory = this.bpmnModeler.get('elementFactory');
        // Get the first element
        const startEvent = this.elementRegistry.find(e => e.type == 'bpmn:StartEvent');
        console.log(startEvent);

        const elements = new Array<any>();
        elements.push(startEvent);

        let lastElement = startEvent;
        this.plan.plan.plan_steps.forEach(step => {
            const iri = new RdfElement(step.capability_applications[0].capability_iri);
            const name = iri.getLocalName();
            const newPosition = new Position((lastElement.x + lastElement.width) +100, lastElement.y);
            const task = this.createServiceTask(name, newPosition);
            this.modeling.connect(lastElement, task, {
                type: 'bpmn:SequenceFlow'
            });
            lastElement = task;
            elements.push(task);
        });

        // In the end, add a end event
        const newPosition = new Position((lastElement.x + lastElement.width) +100, lastElement.y);
        const endEvent = this.createEndEvent(newPosition);
        this.modeling.connect(lastElement, endEvent, {
            type: 'bpmn:SequenceFlow'
        });
        elements.push(endEvent);


        // In the end, align and distribute all elements
        const alignElements = this.bpmnModeler.get('alignElements');
        alignElements.trigger(elements, 'middle');
        const distributeElements = this.bpmnModeler.get('distributeElements');
        distributeElements.trigger(elements, 'horizontal');
    }



    private createEndEvent(elementPosition: Position): any {
        const task = this.elementFactory.createShape({
            type: 'bpmn:EndEvent',
        });

        const position = {
            x: elementPosition.x,
            y: elementPosition.y
        };

        this.modeling.createShape(task, position, this.process);
        return task;
    }

    private createServiceTask(elementName: string, elementPosition: Position): any {
        const task = this.elementFactory.createShape({
            type: 'bpmn:ServiceTask',
        });

        const position = {
            x: elementPosition.x,
            y: elementPosition.y
        };

        this.modeling.createShape(task, position, this.process);
        this.modeling.updateProperties(task, {
            name: elementName
        });
        return task;
    }

}
