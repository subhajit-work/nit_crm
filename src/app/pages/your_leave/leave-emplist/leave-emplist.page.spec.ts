import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveEmplistPage } from './leave-emplist.page';

describe('LeaveEmplistPage', () => {
  let component: LeaveEmplistPage;
  let fixture: ComponentFixture<LeaveEmplistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveEmplistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveEmplistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
