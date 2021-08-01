import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { BaseProperty } from '../Property';

@Component({
    selector: 'bpmn-property',
    templateUrl: './bpmn-property.component.html',
})
export class BpmnPropertyComponent implements OnInit {
    @Input() property: BaseProperty;
    @Input() form: FormGroup;
    childProperties = new FormArray([]);

    ngOnInit(): void {
        // this.form.controls[this.property.key].valueChanges.subscribe(changedValue => {
        // console.log(changedValue);

        // this.childProperties = this.propertyController.updateChildProperties();
        // this.childProperties.push(new FormControl("test", Validators.required));
        // });
    }

    get isValid(): boolean { return this.form.controls[this.property.key].valid; }
    get wasTouched(): boolean {return this.form.controls[this.property.key].touched;}
}
