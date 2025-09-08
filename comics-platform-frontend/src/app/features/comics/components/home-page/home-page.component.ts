import { Component, OnInit } from '@angular/core';
import { ComicsService } from '../../services/comics/comics.service';
import { ComicItem } from '../../../../core/models/comic-item';

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
  isLoading: boolean = false;

  constructor(private comicsService: ComicsService) { }

  ngOnInit(): void {
    this.loadComics();
  }

  loadComics(): void {
    this.isLoading = true;
    this.comicsService.getTopByLatest().subscribe({
      next: (data) => {
        this.comics = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get visibleComics(): ComicItem[] {
    return this.comics.slice(this.startIndex, this.startIndex + this.visibleItems);
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
