import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { environment } from '../environments/environment.prod';
import { AuthData } from './auth-data.model';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private token: string;

  private authStatusListener = new Subject<boolean>();

  private isAuthenticated = false;

  private tokenTimer: ReturnType<typeof setTimeout>;

  private userId: string;

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };

    this.http.post(BACKEND_URL + '/signup', authData).subscribe({
      next: () => {
        this.login(email, password);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.authStatusListener.next(false);
      },
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };

    this.http.post(BACKEND_URL + '/login', authData).subscribe({
      next: (response: {
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;

          this.setAuthTimer(expiresInDuration);

          this.isAuthenticated = true;

          this.userId = response.userId;

          this.authStatusListener.next(true);

          const now = new Date();

          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );

          this.saveAuthData(token, expirationDate, this.userId);

          this.router.navigate(['/']);
        }
      },
      error: (error) => this.authStatusListener.next(false),
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) return;

    const now = new Date();

    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;

      this.isAuthenticated = true;

      this.userId = authInformation.userId;

      this.setAuthTimer(expiresIn / 1000);

      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;

    this.isAuthenticated = false;

    this.authStatusListener.next(false);

    clearTimeout(this.tokenTimer);

    this.clearAuthData();

    this.userId = null;

    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');

    const expirationDate = localStorage.getItem('expiration');

    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) return;

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
