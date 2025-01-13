import { inject, Injectable, signal } from '@angular/core';
import { LOCAL_STORAGE } from '~core/providers/local-storage';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import type { LoginRequest } from '~core/types/login-request.type';
import { environment } from '~environments/environment';
import type { LoginResponse } from '~core/types/login-response.type';
import type { RegisterRequest } from '~core/types/register-request.type';
import type { RegisterResponse, RegisterResponseData } from '~core/types/register-response.type';
import type { User } from '~core/types/user.type';

export const ACCESS_TOKEN_KEY = 'access-token';
const USER_CHANNEL_KEY = 'user-channel';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly storageService = inject(LOCAL_STORAGE);
  private readonly httpClient = inject(HttpClient);
  private readonly isUserLoggedInSignal = signal(!!this.storageService?.getItem(ACCESS_TOKEN_KEY));
  private readonly apiUrl = environment.apiBaseUrl;

  register(registerRequest: RegisterRequest): Observable<RegisterResponseData> {
    const registerEndpoint = `${this.apiUrl}/api/users/register`;

    return this.httpClient
      .post<RegisterResponse>(registerEndpoint, {
        username: registerRequest.username.trim().toLowerCase(),
        password: registerRequest.password,
      })
      .pipe(
        map((response: RegisterResponse) => {
          const { data } = response;
          this.saveUserChannel(data.user.channel); // Save the user channel
          this.saveToken(data);
          this.isUserLoggedInSignal.set(true);
          return data;
        }),
      );
  }

  logIn(loginRequest: LoginRequest): Observable<User> {
    const loginEndpoint = `${this.apiUrl}/api/users/login`;
    return this.httpClient
      .post<LoginResponse>(loginEndpoint, {
        username: loginRequest.username.trim().toLowerCase(),
        password: loginRequest.password,
      })
      .pipe(
        map((response: LoginResponse) => {
          this.isUserLoggedInSignal.set(true);
          const { data } = response;
          this.saveUserChannel(data.user.channel); // Save the user channel
          this.saveToken(data);
          return data.user;
        }),
      );
  }

  logOut() {
    this.removeToken();
    this.removeUserChannel();
    this.isUserLoggedInSignal.set(false);
  }

  isUserLoggedIn(): boolean {
    return this.isUserLoggedInSignal();
  }

  getUserChannel(): string | null {
    return this.storageService?.getItem(USER_CHANNEL_KEY) || null;
  }

  private saveToken(data: { accessToken: string; refreshToken?: string }) {
    this.storageService?.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  }

  private removeToken() {
    this.storageService?.removeItem(ACCESS_TOKEN_KEY);
  }

  private saveUserChannel(channel: string) {
    this.storageService?.setItem(USER_CHANNEL_KEY, channel);
  }

  private removeUserChannel() {
    this.storageService?.removeItem(USER_CHANNEL_KEY);
  }
}
