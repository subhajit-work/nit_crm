import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAddPage } from './payment-add.page';

describe('PaymentAddPage', () => {
  let component: PaymentAddPage;
  let fixture: ComponentFixture<PaymentAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
