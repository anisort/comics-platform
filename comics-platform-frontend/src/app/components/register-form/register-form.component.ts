import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { RegisterFormValidator } from '../../validators/register-form.validator';

@Component({
  selector: 'app-register-form',
  standalone: false,
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent implements OnInit{
  registerForm!: FormGroup;

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), RegisterFormValidator.passwordStrengthValidator()]),
      repeatPassword: new FormControl('', [Validators.required])
    },
    { validators: RegisterFormValidator.passwordMatchValidator() }
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      const user = { username, email, password };
      console.log('User object to send:', user);
    } else {
      console.log('Форма не дійсна');
    }
  }

}
