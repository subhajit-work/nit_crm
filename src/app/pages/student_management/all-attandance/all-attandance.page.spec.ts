import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAttandancePage } from './all-attandance.page';

describe('AllAttandancePage', () => {
  let component: AllAttandancePage;
  let fixture: ComponentFixture<AllAttandancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAttandancePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAttandancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
