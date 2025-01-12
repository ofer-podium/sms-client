import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';

class LocalStorage implements Storage {
  get length(): number {
    try {
      return localStorage.length;
    } catch {
      return 0;
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch {}
  }

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  key(index: number): string | null {
    try {
      return localStorage.key(index);
    } catch {
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      /* Empty */
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Empty */
    }
  }
}

const getStorage = (platformId: object): Storage | null =>
  isPlatformBrowser(platformId) ? new LocalStorage() : null;

export const LOCAL_STORAGE = new InjectionToken<Storage | null>('LOCAL_STORAGE', {
  providedIn: 'root',
  factory: () => getStorage(inject(PLATFORM_ID)),
});
