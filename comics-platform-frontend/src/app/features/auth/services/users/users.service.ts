import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig, CONFIG_TOKEN } from '../../../../../../config';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly apiUrl: string;

    constructor(
      private http: HttpClient,
      @Inject(CONFIG_TOKEN) private config: AppConfig
    ) {
      this.apiUrl = `${this.config.apiUrl}/users`;
    }

    checkUsernameOrEmail(value: string): Observable<{ exists: boolean }> {
      return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-username-email`, {
        params: { value }
      });
    }
}
