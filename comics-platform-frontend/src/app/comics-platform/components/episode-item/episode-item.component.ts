import { Component, Input } from '@angular/core';
import { EpisodeItem } from '../../models/episode-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-episode-item',
  standalone: false,
  templateUrl: './episode-item.component.html',
  styleUrl: './episode-item.component.scss'
})
export class EpisodeItemComponent {
  @Input() episode!: EpisodeItem;
  @Input() index!: number;
  
  constructor(private router: Router) {}

  openEpisode() {
    console.log(`open episode ${this.episode.id}`);
  }

}
