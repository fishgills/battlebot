import { TestBed } from '@angular/core/testing';

import { PopupLoginService } from './popup-login.service';

describe('PopupLoginService', () => {
  let service: PopupLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
