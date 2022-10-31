import { TestBed } from '@angular/core/testing';

import { LocationService.TsService } from './location-service.ts.service';

describe('LocationService.TsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocationService.TsService = TestBed.get(LocationService.TsService);
    expect(service).toBeTruthy();
  });
});
