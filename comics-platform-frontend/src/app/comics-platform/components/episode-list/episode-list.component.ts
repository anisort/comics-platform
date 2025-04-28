import { Component, Input, OnInit } from '@angular/core';
import { EpisodeItem } from '../../models/episode-item';
import { EpisodesService } from '../../services/episodes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-episode-list',
  standalone: false,
  templateUrl: './episode-list.component.html',
  styleUrl: './episode-list.component.scss'
})
export class EpisodeListComponent implements OnInit {

  @Input() comicId!: number;
  episodes: EpisodeItem[] = [];
  isLoading = false;

  constructor(private episodesService: EpisodesService) { }

  ngOnInit(): void {
    this.loadEpisodes();
  }

  loadEpisodes(): void {
    this.isLoading = true;
    this.episodesService.getEpisodesByComic(this.comicId).subscribe({
      next: data => {
        this.episodes = data;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        console.error('Error loading episodes:', err);
      }
    });
  }
}
