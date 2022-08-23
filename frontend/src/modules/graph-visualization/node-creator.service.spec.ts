/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NodeCreatorService } from './node-creator.service';

describe('Service: NodeCreator', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NodeCreatorService]
        });
    });

    it('should ...', inject([NodeCreatorService], (service: NodeCreatorService) => {
        expect(service).toBeTruthy();
    }));
});
