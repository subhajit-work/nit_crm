import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryListPage } from './salary-list.page';

describe('SalaryListPage', () => {
  let component: SalaryListPage;
  let fixture: ComponentFixture<SalaryListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
