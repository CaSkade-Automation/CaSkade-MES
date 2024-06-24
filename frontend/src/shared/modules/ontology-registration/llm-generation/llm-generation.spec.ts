/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LlmGenerationComponent } from './llm-generation.component';

describe('LlmGeneration', () => {
    let component: LlmGenerationComponent;
    let fixture: ComponentFixture<LlmGenerationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LlmGenerationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LlmGenerationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
