/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceLocatorService } from './service-locator.service';

describe('Service: ServiceLocator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceLocatorService]
    });
  });

  it('should ...', inject([ServiceLocatorService], (service: ServiceLocatorService) => {
    expect(service).toBeTruthy();
  }));
});
