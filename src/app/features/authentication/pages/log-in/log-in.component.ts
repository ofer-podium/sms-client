import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AUTH_URLS, ROOT_URLS } from '~core/constants/urls.constants';
import { AuthenticationService } from '~features/authentication/services/authentication.service';
import { alerts } from '../../../../core/constants/alerts.constants';
import { AlertService } from '~core/services/alert.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { passwordValidator } from '~core/validators/password.validator';
import { usernameValidator } from '~core/validators/username.validator';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LogInComponent {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthenticationService);
  private readonly destroyRef = inject(DestroyRef);

  alerts = alerts;
  authUrls = AUTH_URLS;

  username = new FormControl<string>('', [usernameValidator()]);
  password = new FormControl<string>('', [passwordValidator()]);

  logInForm = this.formBuilder.group({
    username: this.username,
    password: this.password,
  });

  isButtonLogInLoading = false;

  sendForm() {
    this.logInForm.markAllAsTouched();
    if (this.logInForm.valid) {
      this.isButtonLogInLoading = true;
      const formValue = this.logInForm.getRawValue();
      this.authService
        .logIn({ username: formValue.username!, password: formValue.password! })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isButtonLogInLoading = false;
            this.changeDetectorRef.markForCheck();
            void this.router.navigate([ROOT_URLS.messages]);
          },
          error: (response) => {
            this.isButtonLogInLoading = false;

            let errorMessage = alerts.genericErrorAlert;
            if (response.error.internalCode === 2002) {
              errorMessage = alerts.loginCredentialsError;
            }
            this.alertService.createErrorAlert(errorMessage);
            this.changeDetectorRef.markForCheck();
          },
        });
    }
  }
}
