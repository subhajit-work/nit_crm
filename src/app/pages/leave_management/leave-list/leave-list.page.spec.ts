import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveListPage } from './leave-list.page';

describe('LeaveListPage', () => {
  let component: LeaveListPage;
  let fixture: ComponentFixture<LeaveListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
