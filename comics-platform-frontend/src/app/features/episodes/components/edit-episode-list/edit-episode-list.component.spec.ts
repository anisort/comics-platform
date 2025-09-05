import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEpisodeListComponent } from './edit-episode-list.component';

describe('EditEpisodeListComponent', () => {
  let component: EditEpisodeListComponent;
  let fixture: ComponentFixture<EditEpisodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEpisodeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEpisodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
