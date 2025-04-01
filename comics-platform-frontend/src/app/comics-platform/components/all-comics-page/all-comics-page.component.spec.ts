import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllComicsPageComponent } from './all-comics-page.component';

describe('AllComicsPageComponent', () => {
  let component: AllComicsPageComponent;
  let fixture: ComponentFixture<AllComicsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllComicsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllComicsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
