/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TransctionService } from './transction.service';

describe('Service: Transction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransctionService]
    });
  });

  it('should ...', inject([TransctionService], (service: TransctionService) => {
    expect(service).toBeTruthy();
  }));
});
