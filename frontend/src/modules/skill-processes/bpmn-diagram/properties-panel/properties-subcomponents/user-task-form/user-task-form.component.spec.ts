/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserTaskFormComponent } from './user-task-form.component';

describe('UserTaskFormComponent', () => {
    let component: UserTaskFormComponent;
    let fixture: ComponentFixture<UserTaskFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ UserTaskFormComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserTaskFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
