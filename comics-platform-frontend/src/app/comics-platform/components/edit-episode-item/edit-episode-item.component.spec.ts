import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEpisodeItemComponent } from './edit-episode-item.component';

describe('EditEpisodeItemComponent', () => {
  let component: EditEpisodeItemComponent;
  let fixture: ComponentFixture<EditEpisodeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEpisodeItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEpisodeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
