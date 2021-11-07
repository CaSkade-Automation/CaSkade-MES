/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaseTaskFormComponent } from './base-task-form.component';

describe('BaseTaskFormComponent', () => {
  let component: BaseTaskFormComponent;
  let fixture: ComponentFixture<BaseTaskFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseTaskFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
