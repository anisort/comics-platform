import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EpisodeItem } from '../../models/episode-item';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditPageListComponent } from '../edit-page-list/edit-page-list.component';

@Component({
  selector: 'app-edit-episode-item',
  standalone: false,
  templateUrl: './edit-episode-item.component.html',
  styleUrl: './edit-episode-item.component.scss'
})
export class EditEpisodeItemComponent implements OnInit {

  @Input() episode!: EpisodeItem;
  @Input() index!: number;

  @Output() updateName = new EventEmitter<{ id: number, name: string}>();
  @Output() deleteEpisode = new EventEmitter<number>();
  @Output() toggleAvailability = new EventEmitter<number>();

  isEditingName = false;
  nameControl = new FormControl('', [Validators.required]);

  constructor(private dialog: MatDialog){}

  ngOnInit(): void {
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
      width: '80%', // Ширина вікна як 80% від ширини екрану
      height: '80%', // Висота вікна як 80% від висоти екрану
      maxWidth: '100vw', // Максимальна ширина 100% екрану
      maxHeight: '100vh', // Максимальна висота 100% екрану
      autoFocus: false // Для відключення автоматичного фокусу на першому елементі
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
