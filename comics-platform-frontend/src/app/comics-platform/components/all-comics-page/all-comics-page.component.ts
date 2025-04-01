import { Component, OnInit } from '@angular/core';
import { ComicsService } from '../../services/comics.service';
import { ComicItem } from '../../models/comic-item';

@Component({
  selector: 'app-all-comics-page',
  standalone: false,
  templateUrl: './all-comics-page.component.html',
  styleUrl: './all-comics-page.component.scss'
})
export class AllComicsPageComponent {
    comics: ComicItem[] = [];
    totalComics: number = 0;
    totalPages: number = 0;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    pageInput: number = 1;
  
    constructor(private comicsService: ComicsService) {}
  
    ngOnInit(): void {
      this.loadComics();
    }
  
    loadComics(): void {
      this.comicsService.getAllComics(this.currentPage, this.itemsPerPage).subscribe(
        (data) => {
          this.comics = data.comics;
          this.totalComics = data.total;
          this.totalPages = data.totalPages ?? 0;
        }
      );
    }
  
    nextPage(): void {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.pageInput = this.currentPage;
        this.loadComics();
      }
    }
  
    prevPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.pageInput = this.currentPage;
        this.loadComics();
      }
    }
  
    goToPage(): void {
      if (this.pageInput < 1) {
        this.currentPage = 1;
      } else if (this.pageInput > this.totalPages) {
        this.currentPage = this.totalPages;
      } else {
        this.currentPage = this.pageInput;
      }
      this.loadComics();
    }
}
