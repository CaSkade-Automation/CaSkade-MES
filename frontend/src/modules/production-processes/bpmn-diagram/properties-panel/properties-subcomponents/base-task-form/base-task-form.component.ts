import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BpmnDataModel, BpmnElement, BpmnProperty } from '../../../BpmnDataModel';
import { BpmnExtensionElementService } from '../../bpmn-extension-element.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'base-task-form',
    templateUrl: './base-task-form.component.html',
    styleUrls: ['./base-task-form.component.scss']
})
export class BaseTaskFormComponent implements OnInit {

    @Input() bpmnElement$: Observable<BpmnElement>;
    @Input() dataModel: BpmnDataModel;

    fg: FormGroup<{
        id: FormControl<string>;
        type: FormControl<string>;
        name: FormControl<string>;
    }>;

    constructor(
        private extensionService: BpmnExtensionElementService,
    ) {}

    ngOnInit() {
        this.handleBpmnElementUpdates();

    }

    handleBpmnElementUpdates() {
        this.bpmnElement$.subscribe(bpmnElement => {
            this.fg = new FormGroup({
                id: new FormControl(bpmnElement?.id),
                type: new FormControl({value: bpmnElement?.type, disabled: true}),
                name: new FormControl(bpmnElement?.businessObject.name)
            });
            this.fg.valueChanges.pipe(debounceTime(100)).subscribe(change => {
                Object.keys(change).forEach(changeKey => {
                    const prop = new BpmnProperty(changeKey, change[changeKey]);
                    this.extensionService.updateBaseProperty(prop);
                });
            });
        });
    }

}
