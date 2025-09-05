import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComicItemMylibraryComponent } from './comic-item-mylibrary.component';

describe('ComicItemMylibraryComponent', () => {
  let component: ComicItemMylibraryComponent;
  let fixture: ComponentFixture<ComicItemMylibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComicItemMylibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComicItemMylibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
