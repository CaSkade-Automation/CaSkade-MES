/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MailFormComponent } from './mail-form.component';

describe('MailFormComponent', () => {
  let component: MailFormComponent;
  let fixture: ComponentFixture<MailFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
