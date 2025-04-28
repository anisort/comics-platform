import { Component, EventEmitter, Output } from '@angular/core';
import { ComicItem } from '../../models/comic-item';
import { ComicsService } from '../../services/comics.service';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchQuery: string = '';
  filteredComics: ComicItem[] = [];

  @Output() comicSelected = new EventEmitter<ComicItem>();

  constructor(private comicsService: ComicsService) { }

  onSearchChange(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredComics = [];
    } else {
      this.comicsService.searchComics(this.searchQuery).subscribe((response) => {
        this.filteredComics = response || [];
      });
    }
  }

  selectComic(comic: ComicItem) {
    this.comicSelected.emit(comic);
    this.searchQuery = '';
    if (this.searchQuery.trim() === '') {
      this.filteredComics = [];
    }
  }

  isSearchFocused: boolean = true;

  onSearchBlur() {
    if (this.searchQuery.trim() === '') {
      this.isSearchFocused = false;
    }
  }

  onSearchFocus() {
    this.isSearchFocused = true;
  }

}