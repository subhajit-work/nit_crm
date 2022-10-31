import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAddPage } from './leave-add.page';

describe('LeaveAddPage', () => {
  let component: LeaveAddPage;
  let fixture: ComponentFixture<LeaveAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
