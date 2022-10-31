import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskReviewPage } from './task-review.page';

describe('TaskReviewPage', () => {
  let component: TaskReviewPage;
  let fixture: ComponentFixture<TaskReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskReviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
