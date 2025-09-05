import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, CONFIG_TOKEN } from '../../../../../../config';
import { Observable } from 'rxjs';
import { PageItem } from '../../../../core/models/page-item';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  private apiUrl: string;
  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) {
    this.apiUrl = `${this.config.apiUrl}/pages`;
  }

  getPagesPublic(episodeId: number, currentPage: number): Observable<{ page: PageItem, totalPages: number, currentPage: number } > {
    let params = new HttpParams();
    params = params.set('page', currentPage.toString());
    return this.http.get<{ page: PageItem, totalPages: number, currentPage: number }>(`${this.apiUrl}/episode/${episodeId}`, {params});
  }

  getPagesForEdit(episodeId: number): Observable<PageItem[]> {
    return this.http.get<PageItem[]>(`${this.apiUrl}/episode/edit/${episodeId}`);
  }

  uploadPages(episodeId: number, files: File[]): Observable<PageItem[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file, file.name));

    return this.http.post<PageItem[]>(`${this.apiUrl}/${episodeId}`, formData);
  }

  reorderPages(episodeId: number, ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reorder/${episodeId}`, { idsInOrder: ids });
  }

  deletePage(pageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${pageId}`);
  }
}
