import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, ActivationResponse } from '../../services/auth/auth.service';
import { filter, map, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-activation',
  standalone: false,
  templateUrl: './activation.component.html',
  styleUrl: './activation.component.scss'
})
export class ActivationComponent implements OnInit, OnDestroy {
  successMessage: string = '';
  errorMessage: string = '';
  username: string = '';
  email: string = '';
  private destroy$ = new Subject<void>();
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$),
      map(params => params.get('token')),
      filter((token): token is string => !!token),
      switchMap(token => this.authService.activateAccount(token)),
    ).subscribe({
      next: (response: ActivationResponse) => {
        this.isLoading = false;
        if ('email' in response && 'username' in response) {
          this.email = response.email;
          this.username = response.username;
          this.successMessage = `Account successfully activated for ${this.username} (${this.email})`;
        } else if ('errorMessage' in response) {
          this.errorMessage = response.errorMessage;
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred while activating your account. Please try again later.';
      }
    });

    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$),
      map(params => params.get('token')),
      filter(token => !token)
    ).subscribe(() => {
      this.errorMessage = 'Invalid activation link.';
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
