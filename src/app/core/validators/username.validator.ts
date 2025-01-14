import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (!value) {
      return { required: true };
    }

    if (value.length < 4) {
      return { minLength: { requiredLength: 4, actualLength: value.length } };
    }

    if (value.length > 20) {
      return { maxLength: { requiredLength: 20, actualLength: value.length } };
    }

    return null;
  };
}
