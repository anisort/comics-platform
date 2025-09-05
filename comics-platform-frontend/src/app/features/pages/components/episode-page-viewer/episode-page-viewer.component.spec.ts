import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodePageViewerComponent } from './episode-page-viewer.component';

describe('EpisodePageViewerComponent', () => {
  let component: EpisodePageViewerComponent;
  let fixture: ComponentFixture<EpisodePageViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EpisodePageViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpisodePageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
