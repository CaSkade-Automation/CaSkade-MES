/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ServiceTaskFormComponent } from './service-task-form.component';

describe('ServiceTaskComponent', () => {
    let component: ServiceTaskFormComponent;
    let fixture: ComponentFixture<ServiceTaskFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ServiceTaskFormComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ServiceTaskFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
