import type { OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AUTH_URLS, ROOT_URLS } from '~core/constants/urls.constants';
import { passwordValidator } from '~core/validators/password.validator';
import { alerts } from '../../../../../app/core/constants/alerts.constants';
import { merge } from 'rxjs';
import { AuthenticationService } from '~features/authentication/services/authentication.service';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import { AlertService } from '~core/services/alert.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { usernameValidator } from '~core/validators/username.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterComponent implements OnInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthenticationService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  alerts = alerts;
  authUrls = AUTH_URLS;
  name = new FormControl('', [Validators.required, Validators.minLength(2)]);

  username = new FormControl<string>('', [usernameValidator()]);
  password = new FormControl<string>('', [passwordValidator()]);
  confirmPassword = new FormControl<string>('', {
    validators: [Validators.required, passwordValidator()],
  });

  registerForm = this.formBuilder.group({
    username: this.username,
    password: this.password,
    confirmPassword: this.confirmPassword,
  });

  isButtonRegisterLoading = false;
  registrationCompleted = false;
  confirmPasswordHelpText = '';

  ngOnInit() {
    merge(this.password.valueChanges, this.confirmPassword.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.checkPasswords();
      });
  }

  checkPasswords() {
    const areValuesEqual = this.password.value === this.confirmPassword.value;
    if (areValuesEqual && this.confirmPassword.getRawValue()) {
      this.confirmPasswordHelpText = '';
      this.confirmPassword.setErrors(null);
    } else {
      if (this.confirmPassword.touched) {
        this.confirmPasswordHelpText = alerts.confirmPasswordHelpText;
      }
      this.confirmPassword.setErrors({ mismatch: true });
    }
  }

  sendForm() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      this.isButtonRegisterLoading = true;
      const formValue = this.registerForm.getRawValue();

      this.authService
        .register({
          username: formValue.username!,
          password: formValue.password!,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.registrationCompleted = true;
            this.changeDetectorRef.markForCheck();
            void this.router.navigate([ROOT_URLS.messages]);
          },
          error: () => {
            this.isButtonRegisterLoading = false;
            this.alertService.createErrorAlert(alerts.genericRegisterError);
            this.changeDetectorRef.markForCheck();
          },
        });
    }
  }
}
