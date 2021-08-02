import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BaseProperty } from '../Property';
import { BpmnPropertyGroup } from '../property-controller/PropertyBuilder';

@Component({
    selector: 'bpmn-property',
    templateUrl: './bpmn-property.component.html',
})
export class BpmnPropertyComponent implements OnInit {
    @Input() propertyGroup: BpmnPropertyGroup;  // The BPMN property group that this component is in charge of
    @Input() form: FormGroup;                   // The parent form that child FormGroups attach to

    childFormGroup: FormGroup;
    childProperties = new FormArray([]);

    ngOnInit(): void {
        this.childFormGroup = this.toFormGroup();
        for (const control in this.form.controls) {
            this.form.removeControl(control);
        }
        this.form.addControl(this.propertyGroup.propertyKey, this.childFormGroup);

        this.childFormGroup.valueChanges.subscribe(data => {
            console.log("changed");
            console.log(data);
        });

        // this.form.controls[this.property.key].valueChanges.subscribe(changedValue => {
        // console.log(changedValue);

        // this.childProperties = this.propertyController.updateChildProperties();
        // this.childProperties.push(new FormControl("test", Validators.required));
        // });
    }


    get isValid(): boolean { return this.form.controls[this.propertyGroup.propertyKey].valid; }
    get wasTouched(): boolean {return this.form.controls[this.propertyGroup.propertyKey].touched;}

    toFormGroup(): FormGroup {
        const group = new FormGroup({});
        const propKey = this.propertyGroup.propertyKey;

        group[propKey] = new FormGroup({});

        this.propertyGroup.properties.forEach(property => {

            if (property.required && property.readonly) {
                group.addControl(property.key, new FormControl({ value: property.value || '', disabled: true }, Validators.required));
            }
            else if (property.required && !property.readonly) {
                group.addControl(property.key, new FormControl({ value: property.value || '', disabled: false }, Validators.required));
            }
            else if (!property.required && property.readonly) {
                group.addControl(property.key, new FormControl({ value: property.value || '', disabled: true }));
            }
            else if (!property.required && !property.readonly) {
                group.addControl(property.key, new FormControl({ value: property.value || '', disabled: false }));
            }
        });

        return group;
    }
}
