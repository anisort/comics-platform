import { Component, Input, OnInit } from '@angular/core';
import { EpisodeItem } from '../../../../core/models/episode-item';
import { EpisodesService } from '../../services/episodes/episodes.service';

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
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
