import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup } from '@angular/forms';
import { BaseProperty, SkillSelectionProperty } from './properties-subcomponents/Property';
import { PropertyController } from './properties-subcomponents/property-controller/PropertyController';
import { SkillService } from 'src/shared/services/skill.service';
import { FlowPropertyController } from './properties-subcomponents/property-controller/FlowPropertyController';
import { ServiceTaskPropertyController } from './properties-subcomponents/property-controller/ServiceTaskPropertyController';

@Component({
    selector: 'properties-panel',
    animations: [
        trigger(
            'enterAnimation', [
                transition(':enter', [
                    style({transform: 'translateX(100%)', opacity: 0}),
                    animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
                ]),
                transition(':leave', [
                    style({transform: 'translateX(0)', opacity: 1}),
                    animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
                ])
            ]
        )
    ],
    templateUrl: './properties-panel.component.html',
    styleUrls: ['./properties-panel.component.scss'],
})
export class PropertiesPanelComponent implements OnChanges {
    @Input() show: boolean;
    @Input() bpmnElement: any;

    propertyController: PropertyController;
    properties: BaseProperty<string>[];

    isMenuOpen = false;

    form: FormGroup;
    payLoad = '';

    constructor(private skillService: SkillService) {}

    ngOnChanges(changes: SimpleChanges): void {
        switch (this.bpmnElement?.type) {
        case "bpmn:SequenceFlow":
            this.propertyController = new FlowPropertyController();
            break;
        case "bpmn:ServiceTask":
            this.propertyController = new ServiceTaskPropertyController(this.skillService);
            break;
        default:
            this.propertyController = new PropertyController();
            break;
        }

        this.properties = this.propertyController.createProperties(this.bpmnElement);
        this.form = this.propertyController.toFormGroup(this.properties);
    }


    onSubmit() {
        this.payLoad = this.form.getRawValue();
        console.log("form value");
        console.log(this.form.value);
        console.log("the form");
        console.log(this.form);

        // apply some transformations to make sure input matches BPMN
        const transformedValues = this.propertyController.transformFormValues(this.payLoad);

    }

    // toggleMenu(): void {
    //     this.isMenuOpen = !this.isMenuOpen;
    // }
}
