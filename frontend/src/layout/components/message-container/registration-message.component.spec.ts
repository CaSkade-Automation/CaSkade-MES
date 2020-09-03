/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RegistrationMessageComponent } from './message-list';

describe('RegistrationMessageComponent', () => {
    let component: RegistrationMessageComponent;
    let fixture: ComponentFixture<RegistrationMessageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RegistrationMessageComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistrationMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
