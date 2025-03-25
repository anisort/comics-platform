import { Pipe, PipeTransform } from '@angular/core';
import { ComicItem } from '../models/comic-item';

@Pipe({
  name: 'search',
  standalone: false
})
export class SearchPipe implements PipeTransform {

  transform(comics: ComicItem[], searchQuery: string): ComicItem[] {
    if(!searchQuery){
      return [];
    }
    searchQuery = searchQuery.toLowerCase();
    const filteredComics = comics.filter(comic => comic.name.toLowerCase().includes(searchQuery));
    return filteredComics.slice(0, 5);
  }

}
