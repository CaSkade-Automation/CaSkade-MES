import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BpmnDataModel, BpmnProperty } from '../../../BpmnDataModel';
import { BaseProperty } from '../Property';
import { BpmnPropertyGroup } from './bpmn-property-group';

@Component({
    selector: 'bpmn-property',
    templateUrl: './bpmn-property.component.html',
})
export class BpmnPropertyComponent implements OnInit {
    @Input() propertyGroup: BpmnPropertyGroup;  // The BPMN property group that this component is in charge of (used for sub form elelemts)
    @Input() form: FormGroup;                   // The parent form that child FormGroups attach to

    @Output() valueChanged: EventEmitter<any> = new EventEmitter();

    bpmnDataModel: BpmnDataModel;
    childFormGroup: FormGroup;
    childProperties = new FormArray([]);

    ngOnInit(): void {
        // set up data model
        this.childFormGroup = this.toFormGroup();
        // for (const control in this.form.controls) {
        //     this.form.removeControl(control);
        // }
        this.form.addControl(this.propertyGroup.propertyKey, this.childFormGroup);

        this.propertyGroup.linkForm(this.childFormGroup);

        // Emit the initial value so that hidden forms are written
        const newValue = this.propertyGroup.getValue();
        const newProp = new BpmnProperty(this.propertyGroup.propertyKey, newValue);
        this.valueChanged.emit(newProp);

        this.childFormGroup.valueChanges.subscribe(data => {
            if(this.childFormGroup.valid) {
                const newValue = this.propertyGroup.getValue();
                const newProp = new BpmnProperty(this.propertyGroup.propertyKey, newValue);
                this.valueChanged.emit(newProp);
            }
        });
    }


    get isValid(): boolean { return this.form.controls[this.propertyGroup.propertyKey].valid; }
    get wasTouched(): boolean {return this.form.controls[this.propertyGroup.propertyKey].touched;}

    toFormGroup(): FormGroup {
        const group = new FormGroup({});
        const propKey = this.propertyGroup.propertyKey;

        group[propKey] = new FormGroup({});

        this.propertyGroup.properties.forEach(property => {
            if (property.required && property.readonly) {
                group.addControl(property.key, new FormControl({ value: property.value, disabled: true }, Validators.required));
            }
            else if (property.required && !property.readonly) {
                group.addControl(property.key, new FormControl({ value: property.value, disabled: false }, Validators.required));
            }
            else if (!property.required && property.readonly) {
                group.addControl(property.key, new FormControl({ value: property.value, disabled: true }));
            }
            else if (!property.required && !property.readonly) {
                group.addControl(property.key, new FormControl({ value: property.value, disabled: false }));
            }
        });
        return group;
    }
}
