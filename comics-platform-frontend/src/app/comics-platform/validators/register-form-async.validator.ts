import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterFormAsyncValidator {

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
