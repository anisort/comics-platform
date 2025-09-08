import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../../../core/models/user.model';
import { AppConfig, CONFIG_TOKEN } from '../../../../../../config';
import { tap } from 'rxjs/operators';


export type ActivationResponse =
  | { email: string; username: string }
  | { errorMessage: string };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl: string;
  private userSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) {
    this.apiUrl = `${this.config.apiUrl}/auth`;
    const savedUser = localStorage.getItem('username');
    if (savedUser) {
      this.userSubject.next(savedUser);
    }
  }

  register(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  activateAccount(token: string): Observable<ActivationResponse> {
    const params = new HttpParams().set('token', token);
    return this.http.get<ActivationResponse>(`${this.apiUrl}/activate`, { params });
  }

  login(username: string, password: string): Observable<{ accessToken: string; username: string }> {
    return this.http.post<{ accessToken: string; username: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('username', response.username);
        this.userSubject.next(response.username);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
