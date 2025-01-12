import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  const validators = [(value: string) => value.length >= 8];

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) {
      return null;
    }
    return validators.every((function_) => function_(value)) ? null : { passwordStrength: true };
  };
}
