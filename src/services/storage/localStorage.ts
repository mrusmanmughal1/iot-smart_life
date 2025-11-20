const STORAGE_PREFIX = 'iot_platform_';

class LocalStorageService {
  private getKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`;
  }

  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serialized);
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }

  clear(): void {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  }

  // Auth-specific methods
  setToken(token: string): void {
    this.set('access_token', token);
  }

  getToken(): string | null {
    return this.get('access_token');
  }

  setRefreshToken(token: string): void {
    this.set('refresh_token', token);
  }

  getRefreshToken(): string | null {
    return this.get('refresh_token');
  }

  removeToken(): void {
    this.remove('access_token');
    this.remove('refresh_token');
  }

  // User-specific methods
  setUser(user: any): void {
    this.set('user', user);
  }

  getUser(): any | null {
    return this.get('user');
  }

  removeUser(): void {
    this.remove('user');
  }

  // Theme methods
  setTheme(theme: 'light' | 'dark'): void {
    this.set('theme', theme);
  }

  getTheme(): 'light' | 'dark' | null {
    return this.get('theme');
  }
}

export const localStorageService = new LocalStorageService();
export default localStorageService;
