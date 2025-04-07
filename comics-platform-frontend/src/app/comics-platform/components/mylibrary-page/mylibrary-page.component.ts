import { Component, OnInit } from '@angular/core';
import { ComicItem } from '../../models/comic-item';
import { ComicsService } from '../../services/comics.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mylibrary-page',
  standalone: false,
  templateUrl: './mylibrary-page.component.html',
  styleUrl: './mylibrary-page.component.scss'
})
export class MyLibraryPageComponent implements OnInit {
  comics: ComicItem[] = [];
  isLoading: boolean = false;
  
  constructor(private comicsService: ComicsService, private router: Router) {}

  ngOnInit() {
    this.loadComics();
  }

  loadComics() {
    this.isLoading = true;
    this.comicsService.getComicsByCurrentUser().subscribe((data) => {
      this.comics = data;
      this.isLoading = false;
    });
  }

  onAddNewComic() {
    this.router.navigate(['comics-platform/add-comic']);
  }
  
  onComicDeleted(id: number) {
    this.isLoading = true;
    this.comicsService.deleteComic(id).subscribe({
      next: () => {
        this.comics = this.comics.filter(comic => comic.id !== id);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}

