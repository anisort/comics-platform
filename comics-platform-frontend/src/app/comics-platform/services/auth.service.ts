import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AppConfig, CONFIG_TOKEN } from '../../../../config';

export type ActivationResponse = 
  | { email: string; username: string }
  | { errorMessage: string };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) {
    this.apiUrl = `${this.config.apiUrl}/auth`;
  }

  register(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  activateAccount(token: string): Observable<ActivationResponse> {
    const params = new HttpParams().set('token', token);
    return this.http.get<ActivationResponse>(`${this.apiUrl}/activate`, { params });
  }

  // checkUsernameOrEmail(value: string): Observable<{ exists: boolean }> {
  //   return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-username-email`, {
  //     params: { value }
  //   });
  // }
}
