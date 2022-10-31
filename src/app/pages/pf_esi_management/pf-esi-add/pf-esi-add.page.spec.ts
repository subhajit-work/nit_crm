import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PfEsiAddPage } from './pf-esi-add.page';

describe('PfEsiAddPage', () => {
  let component: PfEsiAddPage;
  let fixture: ComponentFixture<PfEsiAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PfEsiAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PfEsiAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
