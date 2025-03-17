import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, ActivationResponse } from '../../services/auth.service';

@Component({
  selector: 'app-activation',
  standalone: false,
  templateUrl: './activation.component.html',
  styleUrl: './activation.component.scss'
})
export class ActivationComponent {
  message: string = '';
  errorMessage: string = '';
  username: string = '';
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      let token = params.get('token');
      // console.log('Raw token from URL:', token);

      if (!token){
        this.errorMessage = 'Invalid activation link.';
        return;
      }
  
      this.authService.activateAccount(token).subscribe(
          (response: ActivationResponse) => {
              if ('email' in response && 'username' in response) {
                  this.email = response.email;
                  this.username = response.username;
                  this.message = `Account successfully activated for ${this.username} (${this.email})`;
              } else if ('errorMessage' in response) {
                  this.errorMessage = response.errorMessage;
              }
          },
          (error) => {
              this.errorMessage = 'An error occurred while activating your account. Please try again later.';
              // console.error('Error occurred during activation:', error);
          }
      );
  });
  }
  
  
}
