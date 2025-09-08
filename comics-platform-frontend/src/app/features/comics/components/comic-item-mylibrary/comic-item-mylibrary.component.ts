import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComicItem } from '../../../../core/models/comic-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comic-item-mylibrary',
  standalone: false,
  templateUrl: './comic-item-mylibrary.component.html',
  styleUrl: './comic-item-mylibrary.component.scss'
})
export class ComicItemMylibraryComponent {
  @Input() comicItem!: ComicItem;
  @Output() comicDeleted = new EventEmitter<number>();

  constructor(
    private router: Router,
  ) { }

  openComic() {
    void this.router.navigate(['comics/comic-detail-info', this.comicItem.id]);
  }

  editComic() {
    void this.router.navigate(['comics/edit-comic', this.comicItem.id])
  }

  deleteComic() {
    if (confirm('Are you sure you want to delete this comic?')) {
      this.comicDeleted.emit(this.comicItem.id);
    }
  }
}
