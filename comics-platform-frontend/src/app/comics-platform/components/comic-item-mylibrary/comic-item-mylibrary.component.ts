import { Component, Input } from '@angular/core';
import { ComicItem } from '../../models/comic-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comic-item-mylibrary',
  standalone: false,
  templateUrl: './comic-item-mylibrary.component.html',
  styleUrl: './comic-item-mylibrary.component.scss'
})
export class ComicItemMylibraryComponent {
  @Input() comicItem!: ComicItem;

  constructor(private router: Router) {}

  openComic() {
    this.router.navigate(['comics-platform/comic-detail-info', this.comicItem.id]);
  }

  editComic(){
    console.log('Edit')
  }

  deleteComic(){
    console.log('Delete')
  }
}
