import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialPostsPage } from './social-posts.page';

describe('SocialPostsPage', () => {
  let component: SocialPostsPage;
  let fixture: ComponentFixture<SocialPostsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialPostsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialPostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
