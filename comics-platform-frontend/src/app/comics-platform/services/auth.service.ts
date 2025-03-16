import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export type ActivationResponse = 
  | { email: string; username: string }
  | { errorMessage: string };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  register(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  activateAccount(userId: number): Observable<ActivationResponse> {
    return this.http.get<ActivationResponse>(`${this.apiUrl}/activate/${userId}`);
  }

  checkUsernameOrEmail(value: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-username-email`, {
      params: { value }
    });
  }
}
