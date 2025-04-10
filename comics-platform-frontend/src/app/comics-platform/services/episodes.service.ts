import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, CONFIG_TOKEN } from '../../../../config';
import { EpisodeItem } from '../models/episode-item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EpisodesService {

  private apiUrl: string;
  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) {
    this.apiUrl = `${this.config.apiUrl}/episodes`;
  }

  getEpisodeMeta(id: number): Observable<{comicId: number, episodeName: string}>{
    return this.http.get<{comicId: number, episodeName: string}>(`${this.apiUrl}/${id}`);
  }

  getEpisodesByComic(comicId: number) {
    return this.http.get<EpisodeItem[]>(`${this.apiUrl}/comic/${comicId}`);
  }

  getEpisodesByComicEdit(comicId: number) {
    return this.http.get<EpisodeItem[]>(`${this.apiUrl}/comic/edit/${comicId}`);
  }
  
  updateEpisodeName(id: number, name: string) {
    return this.http.patch<EpisodeItem>(`${this.apiUrl}/${id}`, { name });
  }
  
  deleteEpisode(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  toggleAvailability(id: number) {
    return this.http.patch<EpisodeItem>(`${this.apiUrl}/toggle-availability/${id}`, {});
  }
  
  createEpisode(dto: { comicId: number, name: string }) {
    return this.http.post<EpisodeItem>(`${this.apiUrl}`, dto);
  }
  
  reorderEpisodes(comicId: number, ids: number[]) {
    return this.http.post<EpisodeItem[]>(`${this.apiUrl}/reorder/${comicId}`, { idsInOrder: ids });
  }
  
}
