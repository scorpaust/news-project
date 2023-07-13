import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private token: string;

  private authStatusListener = new Subject<boolean>();

  private isAuthenticated = false;

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post('http://localhost:3000/api/user/login', authData)
      .subscribe((response: { message: string; token: string }) => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
        }
        this.authStatusListener.next(true);

        this.router.navigate(['/']);
      });
  }

  logout() {
    this.token = null;

    this.isAuthenticated = false;

    this.authStatusListener.next(false);

    this.router.navigate(['/']);
  }
}
