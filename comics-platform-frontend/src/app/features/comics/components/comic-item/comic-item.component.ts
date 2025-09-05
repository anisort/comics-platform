import { Component, Input } from '@angular/core';
import { ComicItem } from '../../../../core/models/comic-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comic-item',
  standalone: false,
  templateUrl: './comic-item.component.html',
  styleUrl: './comic-item.component.scss'
})
export class ComicItemComponent {
  @Input() comicItem!: ComicItem

  constructor(private router: Router) { }

  openComic() {
    this.router.navigate(['comics/comic-detail-info', this.comicItem.id]);
  }
}
