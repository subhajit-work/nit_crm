import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkupdateListPage } from './workupdate-list.page';

describe('WorkupdateListPage', () => {
  let component: WorkupdateListPage;
  let fixture: ComponentFixture<WorkupdateListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkupdateListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkupdateListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
