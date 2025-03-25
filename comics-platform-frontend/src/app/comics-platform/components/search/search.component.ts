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

  constructor(private comicsService: ComicsService) {}

  onSearchChange(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredComics = [];
    }
    else {
      this.comicsService.getAllComics().subscribe((response) => {
        if (response && response.comics) {
          this.filteredComics = response.comics
            .filter((comic: ComicItem) =>
              comic.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            )
            //.slice(0, 5);
        }
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

  // Обработчик потери фокуса
  onSearchBlur() {
    // Если текст пустой, скрываем результаты
    if (this.searchQuery.trim() === '') {
      this.isSearchFocused = false;
    }
  }

  // Обработчик фокуса на поле ввода
  onSearchFocus() {
    this.isSearchFocused = true;
  }

}