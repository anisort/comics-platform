import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { CustomValidator } from '../../validators/custom.validator';

@Component({
  selector: 'app-register-form',
  standalone: false,
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    private authService: AuthService,) { }

  registerForm!: FormGroup;
  message: string | null = null;
  isLoading: boolean = false;

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)], CustomValidator.checkUniqueUsernameAndEmail(this.usersService)),
      email: new FormControl('', [Validators.required, Validators.email], CustomValidator.checkUniqueUsernameAndEmail(this.usersService)),
      password: new FormControl('', [Validators.required, Validators.minLength(8), CustomValidator.passwordStrengthValidator()]),
      repeatPassword: new FormControl('', [Validators.required])
    },
      { validators: CustomValidator.passwordMatchValidator() }
    );
  }

  register() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { username, email, password } = this.registerForm.value;
      const user: User = { username, email, password };
      console.log('User object to send:', user);

      this.authService.register(user).subscribe({
        next: () => {
          this.isLoading = false;
          this.message = 'An activation link has been sent to your email. It will expire in 5 minutes.';
          this.registerForm.reset();
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err)
        }
      })
    } else {
      console.log('Form is disabled');
    }
  }

}
