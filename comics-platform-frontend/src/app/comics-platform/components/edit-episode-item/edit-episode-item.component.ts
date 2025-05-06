import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EpisodeItem } from '../../models/episode-item';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditPageListComponent } from '../edit-page-list/edit-page-list.component';
import { CustomValidator } from '../../validators/custom.validator';
import { EpisodesService } from '../../services/episodes.service';

@Component({
  selector: 'app-edit-episode-item',
  standalone: false,
  templateUrl: './edit-episode-item.component.html',
  styleUrl: './edit-episode-item.component.scss'
})
export class EditEpisodeItemComponent implements OnInit {

  @Input() episode!: EpisodeItem;
  @Input() index!: number;
  @Input() comicId!: number;

  @Output() updateName = new EventEmitter<{ id: number, name: string }>();
  @Output() deleteEpisode = new EventEmitter<number>();
  @Output() toggleAvailability = new EventEmitter<number>();

  isEditingName = false;
  nameControl = new FormControl();

  constructor(private dialog: MatDialog, private episodesService: EpisodesService) { }

  ngOnInit(): void {
    this.nameControl = new FormControl('', [Validators.required, Validators.minLength(3)], CustomValidator.uniqueEpisodeNameValidator(this.episodesService, this.comicId, this.episode.name));
    this.nameControl.setValue(this.episode.name);
  }

  startEditName(): void {
    this.isEditingName = true;
  }

  cancelEdit(): void {
    this.isEditingName = false;
    this.nameControl.setValue(this.episode.name);
  }

  saveName(): void {
    if (this.nameControl.valid) {
      this.updateName.emit({ id: this.episode.id, name: this.nameControl.value as string });
      this.isEditingName = false;
    }
  }

  openPagesEditor(): void {
    this.dialog.open(EditPageListComponent, {
      data: {
        episodeId: this.episode.id,
        episodeName: this.episode.name
      },
      width: '80%',
      height: '80%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      autoFocus: false,
    });
  }

  confirmDelete(): void {
    if (confirm('Are you sure you want to delete this episode?')) {
      this.deleteEpisode.emit(this.episode.id);
    }
  }

  toggleAvailable(): void {
    this.toggleAvailability.emit(this.episode.id);
  }

}
