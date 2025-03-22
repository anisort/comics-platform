import { Component, Input } from '@angular/core';
import { ComicItem } from '../../models/comic-item';

@Component({
  selector: 'app-comic-item',
  standalone: false,
  templateUrl: './comic-item.component.html',
  styleUrl: './comic-item.component.scss'
})
export class ComicItemComponent {
  @Input() comicItem!: ComicItem
}
