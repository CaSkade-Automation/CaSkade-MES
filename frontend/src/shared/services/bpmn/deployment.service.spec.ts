/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeploymentService } from './deployment.service';

describe('Service: Deployment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeploymentService]
    });
  });

  it('should ...', inject([DeploymentService], (service: DeploymentService) => {
    expect(service).toBeTruthy();
  }));
});
