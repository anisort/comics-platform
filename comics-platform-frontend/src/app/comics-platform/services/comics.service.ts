import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfig, CONFIG_TOKEN } from '../../../../config';
import { Observable } from 'rxjs';
import { ComicItem } from '../models/comic-item';
import { ComicSingleItem } from '../models/comic-single-item';
import { CreateComic } from '../models/create-comic';


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

  getComicsByUsername(username: string): Observable<ComicItem[]> {
      return this.http.get<ComicItem[]>(`${this.apiUrl}/my-library/${username}`)
  }

  getAllComics(page?: number, limit?: number): Observable<{ comics: ComicItem[], total: number, totalPages?: number }> {
    let params = new HttpParams();
    if (page !== undefined && limit !== undefined) {
      params = params.set('page', page.toString()).set('limit', limit.toString());
    }
    return this.http.get<{ comics: ComicItem[], total: number, totalPages?: number }>(this.apiUrl, { params });
  }

  getComicById(id: number): Observable<ComicSingleItem>{
    return this.http.get<ComicSingleItem>(`${this.apiUrl}/${id}`)
  }

  createComic(formData: FormData): Observable<CreateComic> {
    return this.http.post<CreateComic>(this.apiUrl, formData);
  }
}





  // getAllComics(): Observable<ComicItem[]> {
  //   return this.http.get<ComicItem[]>(this.apiUrl)
  // }


  // getAllComics(page: number, limit: number): Observable<{ comics: ComicItem[], total: number, totalPages: number }> {
  //   let params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('limit', limit.toString());

  //   return this.http.get<{ comics: ComicItem[], total: number, totalPages: number }>(this.apiUrl, { params });
  // }
