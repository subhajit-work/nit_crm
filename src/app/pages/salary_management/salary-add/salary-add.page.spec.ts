import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAddPage } from './salary-add.page';

describe('SalaryAddPage', () => {
  let component: SalaryAddPage;
  let fixture: ComponentFixture<SalaryAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
