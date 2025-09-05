import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComicSingleItemComponent } from './comic-single-item.component';

describe('ComicSingleItemComponent', () => {
  let component: ComicSingleItemComponent;
  let fixture: ComponentFixture<ComicSingleItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComicSingleItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComicSingleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
