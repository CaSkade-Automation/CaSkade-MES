/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProcessInstanceService } from './process-instance.service';

describe('Service: ProcessInstance', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ProcessInstanceService]
        });
    });

    it('should ...', inject([ProcessInstanceService], (service: ProcessInstanceService) => {
        expect(service).toBeTruthy();
    }));
});
