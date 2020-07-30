/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CommandFeatureComponent } from './command-feature.component';

describe('CommandFeatureComponent', () => {
    let component: CommandFeatureComponent;
    let fixture: ComponentFixture<CommandFeatureComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CommandFeatureComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommandFeatureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
