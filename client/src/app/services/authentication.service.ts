import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {
  private token: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  //Expanded Communication Methods

  public completePasswordReset(email: string, password: string, accessKey: string): Observable<any> {
    return this.makeRequest('post', 'resetEmail', {
      emailAddress: email,
      password: password,
      accessKey: accessKey
    });
  }

  public requestPasswordReset(email: string): Observable<any> {
    return this.makeRequest('post', 'sendResetEmail', {
      emailAddress: email
    });
  }

  public loadInstitutions(query: string): Observable<any> {
    return this.requestData('post', 'getInstitutions', {
      institution: query
    });
  }

  public preregister(email: string): Observable<any> {
    return this.makeRequest('post', 'preRegistration', {
      email: email
    });
  }

  public verifyAccessKey(accessKey: string): Observable<any> {
    return this.requestData('post', 'verifyAccessKey', {
      accessKey: accessKey
    });
  }

  public completeRegistration(emailAddress: string, username: string, password: string, institution: string, notifications: boolean, accessKey: string): Observable<any> {
    return this.requestData('post', 'register', {
      emailAddress: emailAddress,
      username: username,
      password: password,
      institution: institution,
      accessKey: accessKey,
      getNotifications: notifications
    });
  }

  //Base Communication Methods

  public requestLogin(user: TokenPayload): Observable<any> {
    let base = this.http.post(`/api/login`, user);
    const request = base.pipe(
      map((data: TokenResponse) => {
        if(data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
  }

  public makeRequest(method: 'post'|'get', location: string, data?): Observable<any> {
    if(method == 'post') {
      return this.http.post(`/api/${location}`, data, { headers: { Authorization: `Bearer ${this.getToken()}` } });
    } else {
      return this.http.get(`/api/${location}`, { headers: { Authorization: `Bearer ${this.getToken()}` } });
    }
  }


  public requestData(method: 'post'|'get', location: string, data?): Observable<any> {
    let base;
    if(method == 'post') {
      base = this.http.post(`/api/${location}`, data, { headers: { Authorization: `Bearer ${this.getToken()}` } });
    } else {
      base = this.http.get(`/api/${location}`, { headers: { Authorization: `Bearer ${this.getToken()}` } });
    }
    const request = base.pipe(
      map((data: TokenResponse) => {
        if(data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
  }

  /** Parse Token in storage into JSON */
  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if(token) {
      console.log("Token Found");
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    }
  }

  /**Check if unexpired Token exists */
  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if(user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private getToken(): string {
    if(!this.token) {
      this.token = localStorage.getItem('youforgot-user-token');
    }
    return this.token;
  }

  private saveToken(token: string): void {
    localStorage.setItem('youforgot-user-token', token);
    this.token = token;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('youforgot-user-token');
    console.log("User Logged Off");
    this.router.navigateByUrl('/');
  }

  public canActivate(): boolean {
    if(!this.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}

export interface UserDetails {
  emailAddress: string;
  username: string;
  image: string;//URL?
  profileRating: number;
  getPostReminderNotifications: boolean;
  getHomeworkReminderNotifications: boolean;
  exp: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
}
