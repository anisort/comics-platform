import { Component, Input, OnInit } from '@angular/core';
import { EpisodeItem } from '../../models/episode-item';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {  Router } from '@angular/router';
import { EpisodesService } from '../../services/episodes.service';
import { FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../validators/custom.validator';


@Component({
  selector: 'app-edit-episode-list',
  standalone: false,
  templateUrl: './edit-episode-list.component.html',
  styleUrl: './edit-episode-list.component.scss'
})
export class EditEpisodeListComponent implements OnInit {
  @Input() comicId!: number;

  episodes: EpisodeItem[] = [];
  isReorderChanged = false;
  isLoading = false;
  newEpisodeControl = new FormControl();


  constructor(private episodesService: EpisodesService, private router: Router) {}


  ngOnInit(): void {
    
    this.newEpisodeControl = new FormControl(
      '',
      [Validators.required, Validators.minLength(3)],
      [CustomValidator.uniqueEpisodeNameValidator(this.episodesService, this.comicId)]
    );
    this.loadEpisodes();
  }

  loadEpisodes(): void {
    this.isLoading = true;
    this.episodesService.getEpisodesByComicEdit(this.comicId).subscribe({
      next: data => {
        this.episodes = data;
        this.isReorderChanged = false;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/comics-platform/login']);
        } else {
          console.error('Error comics loading:', err);
        }
      }
    });
  }

  onNameUpdate(event: { id: number, name: string }) {
    this.isLoading = true;
    this.episodesService.updateEpisodeName(event.id, event.name).subscribe({
      next: () => {
        this.loadEpisodes();
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/comics-platform/login']);
        } else {
          console.error('Error updating episode name:', err);
        }
      }
    });
  }

  onDelete(id: number) {
    this.isLoading = true;
    this.episodesService.deleteEpisode(id).subscribe({
      next: () => {
        this.loadEpisodes();
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/comics-platform/login']);
        } else {
          console.error('Error deleting episode:', err);
        }
      }
    });
  }

  onToggleAvailability(id: number) {
    this.isLoading = true;
    this.episodesService.toggleAvailability(id).subscribe({
      next: () => {
        this.loadEpisodes();
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/comics-platform/login']);
        } else {
          console.error('Error toggling availability:', err);
        }
      }
    });
  }

  addEpisode() {
    const comicName = this.newEpisodeControl.value?.trim()!;
    if (this.newEpisodeControl.valid){
      this.isLoading = true;
      this.episodesService.createEpisode({ comicId: this.comicId, name: comicName }).subscribe({
        next: () => {
          this.newEpisodeControl.reset();
          this.loadEpisodes();
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          if (err.status === 401) {
            this.router.navigate(['/comics-platform/login']);
          } else {
            console.error('Error creating episode:', err);
          }
        }
      });
    }
  }
  

  drop(event: CdkDragDrop<EpisodeItem[]>) {
    moveItemInArray(this.episodes, event.previousIndex, event.currentIndex);
    this.isReorderChanged = true;
  }

  saveOrder() {
    const newOrder = this.episodes.map(e => e.id);
    this.isLoading = true;
    this.episodesService.reorderEpisodes(this.comicId, newOrder).subscribe({
      next: () => {
        this.isReorderChanged = false;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/comics-platform/login']);
        } else {
          console.error('Error saving episode order:', err);
        }
      }
    });
  }
}

