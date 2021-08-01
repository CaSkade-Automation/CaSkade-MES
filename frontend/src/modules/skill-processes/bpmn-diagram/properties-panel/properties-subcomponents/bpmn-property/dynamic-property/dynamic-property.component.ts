import { Component, OnInit, Input } from '@angular/core';
import { BaseProperty } from '../../Property';
import { FormGroup, FormArray} from '@angular/forms';

@Component({
    selector: 'dynamic-property',
    templateUrl: './dynamic-property.component.html',
    styleUrls: ['./dynamic-property.component.scss']
})
export class DynamicPropertyComponent implements OnInit {
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
