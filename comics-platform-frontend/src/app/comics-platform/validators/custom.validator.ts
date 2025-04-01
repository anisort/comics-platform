import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { UsersService } from '../services/users.service';

@Injectable({
    providedIn: 'root',
  })
export class CustomValidator {
    static passwordStrengthValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value: string = control.value || '';
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumber = /\d/.test(value);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

            const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
            return !isValid ? { weakPassword: true } : null;
        };
    }

    static passwordMatchValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.get('password')?.value;
            const repeatPassword = control.get('repeatPassword')?.value;

            return password === repeatPassword ? null : { passwordMismatch: true };
        };
    }

    static checkUniqueUsernameAndEmail(usersService: UsersService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
          if (!control.value) {
            return of(null);
          }
    
          const value = control.value.trim();
          
          return usersService.checkUsernameOrEmail(value).pipe(
            debounceTime(300),
            switchMap((response) => {
              if (response.exists) {
                return of({ usernameOrEmailTaken: true });
              }
              return of(null);
            }),
            catchError(() => of(null))
          );
        };
    }


}