import { TestBed } from '@angular/core/testing';

import { ProcessDefinitionService } from './process-definition.service';

describe('ProcessControlService', () => {
    let service: ProcessDefinitionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProcessDefinitionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
