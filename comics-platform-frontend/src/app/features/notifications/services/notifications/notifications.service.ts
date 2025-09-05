import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, CONFIG_TOKEN } from '../../../../../../config';
import { Observable } from 'rxjs';
import { Notification } from '../../../../core/models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private apiUrl: string;
  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) {
    this.apiUrl = `${this.config.apiUrl}/notifications`;
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<Notification[]> {
    return this.http.patch<Notification[]>(`${this.apiUrl}/read-all`, {});
  }
}
