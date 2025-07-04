import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapabilityEditorComponent } from './capability-editor.component';

describe('CapabilityEditorComponent', () => {
  let component: CapabilityEditorComponent;
  let fixture: ComponentFixture<CapabilityEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapabilityEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapabilityEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
