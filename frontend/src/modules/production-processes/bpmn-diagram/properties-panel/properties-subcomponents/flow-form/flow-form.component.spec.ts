/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlowFormComponent } from './flow-form.component';

describe('FlowFormComponent', () => {
    let component: FlowFormComponent;
    let fixture: ComponentFixture<FlowFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ FlowFormComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FlowFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
