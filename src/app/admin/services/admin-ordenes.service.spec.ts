import { TestBed } from '@angular/core/testing';

import { AdminOrdenesService } from './admin-ordenes.service';

describe('AdminOrdenesService', () => {
  let service: AdminOrdenesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminOrdenesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
