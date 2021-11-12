import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BpmnProperty } from '../../../BpmnDataModel';

@Component({
    selector: 'flow-form',
    templateUrl: './flow-form.component.html',
    styleUrls: ['./flow-form.component.scss']
})
export class FlowFormComponent implements OnInit {

    @Input() bpmnElement;
    @Output() basePropertyUpdated = new EventEmitter<BpmnProperty>();

    fg: FormGroup;

    ngOnInit(): void {
        this.fg = new FormGroup({
            condition: new FormControl(this.bpmnElement["condition"]),
        });

        this.condition.valueChanges.pipe(debounceTime(100)).subscribe(condition => {
            const prop = new BpmnProperty("condition", condition);
            this.basePropertyUpdated.emit(prop);
        });
    }

    get condition(): FormControl {
        return this.fg.controls.condition as FormControl;
    }

}
