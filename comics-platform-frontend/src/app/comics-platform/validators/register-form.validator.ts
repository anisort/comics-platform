import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class RegisterFormValidator {
    static passwordStrengthValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value: string = control.value || '';

            // Проверка на наличие:
            const hasUpperCase = /[A-Z]/.test(value); // Заглавные буквы
            const hasLowerCase = /[a-z]/.test(value); // Строчные буквы
            const hasNumber = /\d/.test(value); // Цифры
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value); // Специальные символы

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


}