import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError, map, first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterFormAsyncValidator {

  // constructor(private authService: AuthService) {}

  static checkUniqueUsernameAndEmail(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null); // Пропускаем проверку, если поле пустое
      }

      const value = control.value.trim();
      
      return authService.checkUsernameOrEmail(value).pipe(
        debounceTime(300), // Применяем задержку для оптимизации запросов
        switchMap((response) => {
          if (response.exists) {
            return of({ usernameOrEmailTaken: true });
          }
          return of(null); // Всё в порядке
        }),
        catchError(() => of(null)) // В случае ошибки возвращаем null
      );
    };
  }
}
