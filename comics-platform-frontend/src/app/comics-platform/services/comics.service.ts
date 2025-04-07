import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfig, CONFIG_TOKEN } from '../../../../config';
import { Observable } from 'rxjs';
import { ComicItem } from '../models/comic-item';
import { ComicSingleItem } from '../models/comic-single-item';
import { CreateUpdateComic } from '../models/create-update-comic';


@Injectable({
  providedIn: 'root'
})
export class ComicsService {

  private apiUrl: string;
  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) {
    this.apiUrl = `${this.config.apiUrl}/comics`;
  }

  getAllComics(page: number, limit: number): Observable<{ comics: ComicItem[], total: number, totalPages: number }> {
    let params = new HttpParams();
    params = params.set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<{ comics: ComicItem[], total: number, totalPages: number }>(this.apiUrl, { params });
  }


  getComicById(id: number): Observable<ComicSingleItem | null>{
    return this.http.get<ComicSingleItem | null>(`${this.apiUrl}/${id}`)
  }

  searchComics(query: string): Observable<ComicItem[]> {
    let params = new HttpParams();
    params = params.set('query', query.toString());
    return this.http.get<ComicItem[]>(`${this.apiUrl}/search`, {params});
  }
  

  getComicsByCurrentUser(): Observable<ComicItem[]> {
    return this.http.get<ComicItem[]>(`${this.apiUrl}/my-library`)
  }

  createComic(formData: FormData): Observable<CreateUpdateComic> {
    return this.http.post<CreateUpdateComic>(this.apiUrl, formData);
  }

  updateComic(id: number, formData: FormData): Observable<CreateUpdateComic> {
    return this.http.put<CreateUpdateComic>(`${this.apiUrl}/${id}`, formData);
  }

  deleteComic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkName(name: string): Observable<{ exists: boolean }> {
    let params = new HttpParams();
    params = params.set('name', name.toString());
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-name`, {params});
  }

  checkAuthority(id: number): Observable<{isAuthor: boolean}> {
    return this.http.get<{isAuthor: boolean}>(`${this.apiUrl}/check-authority/${id}`);
  }
  
}
