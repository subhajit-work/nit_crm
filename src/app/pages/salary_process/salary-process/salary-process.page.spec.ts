import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryProcessPage } from './salary-process.page';

describe('SalaryProcessPage', () => {
  let component: SalaryProcessPage;
  let fixture: ComponentFixture<SalaryProcessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryProcessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryProcessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
