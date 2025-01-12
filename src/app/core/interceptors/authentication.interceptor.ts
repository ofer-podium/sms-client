import type {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import type { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ACCESS_TOKEN_KEY,
  AuthenticationService,
} from '~features/authentication/services/authentication.service';
import { AppError } from '~core/enums/app-error.enum';
import { AUTH_URLS } from '~core/constants/urls.constants';
import { LOCAL_STORAGE } from '~core/providers/local-storage';
import { AlertService } from '~core/services/alert.service';

export function authenticationInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authenticationService = inject(AuthenticationService);
  const alertService = inject(AlertService);
  const storageService = inject(LOCAL_STORAGE);
  const router = inject(Router);

  const clonedRequest = attachAccessToken(request, storageService);
  return handleRequest({
    request: clonedRequest,
    next,
    authenticationService,
    alertService,
    storageService,
    router,
  });
}

function attachAccessToken(
  request: HttpRequest<unknown>,
  storageService: Storage | null,
): HttpRequest<unknown> {
  const accessToken = storageService?.getItem(ACCESS_TOKEN_KEY);
  if (accessToken) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return request;
}

function handleRequest(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  authenticationService: AuthenticationService;
  alertService: AlertService;
  storageService: Storage | null;
  router: Router;
}): Observable<HttpEvent<unknown>> {
  return parameters.next(parameters.request).pipe(
    catchError((errorResponse: HttpErrorResponse) =>
      handleErrors({
        errorResponse,
        ...parameters,
      }),
    ),
  );
}

function handleErrors(parameters: {
  request: HttpRequest<unknown>;
  next: HttpHandlerFn;
  authenticationService: AuthenticationService;
  alertService: AlertService;
  storageService: Storage | null;
  router: Router;
  errorResponse: HttpErrorResponse;
}): Observable<HttpEvent<unknown>> {
  if (isAccessTokenError(parameters.errorResponse)) {
    // return tryRefreshToken(parameters);
    parameters.authenticationService.logOut();
    void parameters.router.navigate([AUTH_URLS.logIn]);
    return throwError(() => new Error('Session expired. Please log in again.'));
  }

  return throwError(() => parameters.errorResponse);
}

function isAccessTokenError(errorResponse: HttpErrorResponse): boolean {
  return (
    errorResponse.status === 401 &&
    [AppError.ACCESS_TOKEN_NOT_FOUND, AppError.ACCESS_TOKEN_EXPIRED].includes(
      errorResponse.error.internalCode,
    )
  );
}
