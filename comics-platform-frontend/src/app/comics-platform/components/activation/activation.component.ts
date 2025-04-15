import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, ActivationResponse } from '../../services/auth.service';
import { filter, map, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-activation',
  standalone: false,
  templateUrl: './activation.component.html',
  styleUrl: './activation.component.scss'
})
export class ActivationComponent implements OnInit, OnDestroy{
  successMessage: string = '';
  errorMessage: string = '';
  username: string = '';
  email: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  // ngOnInit(): void {
  //   this.route.queryParamMap.subscribe(params => {
  //     let token = params.get('token');
  //     if (!token){
  //       this.errorMessage = 'Invalid activation link.';
  //       return;
  //     }
  
  //     this.authService.activateAccount(token).subscribe({
  //       next: (response: ActivationResponse) => {
  //         if ('email' in response && 'username' in response) {
  //           this.email = response.email;
  //           this.username = response.username;
  //           this.successMessage = `Account successfully activated for ${this.username} (${this.email})`;
  //         } else if ('errorMessage' in response) {
  //           this.errorMessage = response.errorMessage;
  //         }
  //       },
  //       error: () => {
  //         this.errorMessage = 'An error occurred while activating your account. Please try again later.';
  //       }
  //     });
      
  // });
  // }
  
  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$),
      map(params => params.get('token')),
      filter((token): token is string => !!token), // пропускаємо лише валідні токени
      switchMap(token => this.authService.activateAccount(token)),
    ).subscribe({
      next: (response: ActivationResponse) => {
        if ('email' in response && 'username' in response) {
          this.email = response.email;
          this.username = response.username;
          this.successMessage = `Account successfully activated for ${this.username} (${this.email})`;
        } else if ('errorMessage' in response) {
          this.errorMessage = response.errorMessage;
        }
      },
      error: () => {
        this.errorMessage = 'An error occurred while activating your account. Please try again later.';
      }
    });

    // Додатковий обробник для випадку, якщо токен взагалі не передано
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
