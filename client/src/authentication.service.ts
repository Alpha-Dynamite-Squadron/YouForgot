import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  //Expanded Communication Methods

  public preregister(emailAddress: string): Observable<any> {
    return this.requestData('post', 'preregister', {
      emailAddress: emailAddress
    });
  }

  public findRegistration(accessKey: string): Observable<any> {
    return this.requestData('post', 'findRegistration', {
      accessKey: accessKey
    });
  }

  public completeRegistration(emailAddress: string, userName: string, imageID: string, password: string, accessKey: string): Observable<any> {
    return this.requestData('post', 'completeRegistration', {
      emailAddress: emailAddress,
      userName: userName,
      imageID: imageID,
      password: password,
      accessKey: accessKey
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
}

export interface UserDetails {
  emailAddress: string;
  username: string;
  image: string;//URL?
  profileRating: number;
  getPostReminderNotifications: boolean;
  getHomeworkReminderNotifications: boolean;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
}
