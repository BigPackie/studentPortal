import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionDetailPage } from './promotion-detail.page';

describe('PromotionDetailPage', () => {
  let component: PromotionDetailPage;
  let fixture: ComponentFixture<PromotionDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
