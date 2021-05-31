import { TestBed } from '@angular/core/testing';

import { ProcessControlService } from './process-control.service';

describe('ProcessControlService', () => {
  let service: ProcessControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
