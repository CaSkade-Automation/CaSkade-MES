/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { MessageService } from './message.service';

describe('Service: Message', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MessageService]
        });
    });

    it('should ...', inject([MessageService], (service: MessageService) => {
        expect(service).toBeTruthy();
    }));
});
