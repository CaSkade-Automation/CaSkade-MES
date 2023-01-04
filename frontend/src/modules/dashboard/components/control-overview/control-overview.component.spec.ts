import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ControlOverviewComponent } from './control-overview.component';

describe('ControlOverviewComponent', () => {
    let component: ControlOverviewComponent;
    let fixture: ComponentFixture<ControlOverviewComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ ControlOverviewComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
