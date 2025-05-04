import { Component, OnInit } from '@angular/core';
import { ComicsService } from '../../services/comics.service';
import { ComicItem } from '../../models/comic-item';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  comics: ComicItem[] = [];
  startIndex: number = 0;
  visibleItems: number = 3;

  constructor(private comicsService: ComicsService) { }

  ngOnInit(): void {
    this.loadComics();
  }

  loadComics(): void {
    this.comicsService.getTopByLatest().subscribe((data) => {
      this.comics = data;
    });
  }

  prevComic(): void {
    if (this.startIndex > 0) {
      this.startIndex -= this.visibleItems;
    }
  }

  nextComic(): void {
    if (this.startIndex + this.visibleItems < this.comics.length) {
      this.startIndex += this.visibleItems;
    }
  }
}
