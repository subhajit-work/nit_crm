import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAddPage } from './course-add.page';

describe('CourseAddPage', () => {
  let component: CourseAddPage;
  let fixture: ComponentFixture<CourseAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
