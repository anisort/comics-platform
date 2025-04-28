import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, CONFIG_TOKEN } from '../../../../config';
import { Observable } from 'rxjs';
import { ComicItem } from '../models/comic-item';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) {
    this.apiUrl = `${this.config.apiUrl}/subscriptions`;
  }

  subscribe(comicId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${comicId}`, {});
  }

  unsubscribe(comicId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${comicId}`);
  }

  getMySubscriptions(): Observable<ComicItem[]>{
    return this.http.get<ComicItem[]>(`${this.apiUrl}/my-list`);
  }

  checkSubscription(comicId: number): Observable<{ isSubscribed: boolean }> {
    return this.http.get<{ isSubscribed: boolean }>(`${this.apiUrl}/${comicId}/check`);
  }
  
}
