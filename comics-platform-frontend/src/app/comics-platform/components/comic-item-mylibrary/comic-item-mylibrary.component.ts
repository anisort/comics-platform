import { Component, Input } from '@angular/core';
import { ComicItem } from '../../models/comic-item';

@Component({
  selector: 'app-comic-item-mylibrary',
  standalone: false,
  templateUrl: './comic-item-mylibrary.component.html',
  styleUrl: './comic-item-mylibrary.component.scss'
})
export class ComicItemMylibraryComponent {
  @Input() comicItem!: ComicItem
}
