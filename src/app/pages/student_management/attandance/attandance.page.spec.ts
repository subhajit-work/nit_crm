import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttandancePage } from './attandance.page';

describe('AttandancePage', () => {
  let component: AttandancePage;
  let fixture: ComponentFixture<AttandancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttandancePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttandancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
