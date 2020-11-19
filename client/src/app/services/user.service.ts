import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  public fetchUserInformation(): Observable<any> {
    if(this.user) {
      return of(this.user);
    } else {
      console.log("Retrieving User Data from Server");
      return this.authService.requestData('get', 'getUserInfo').pipe(
        map((data) => {
          this.user = new User(data.userEmail, data.username, data.imageID, data.postNotifications, data.deadlineNotifications, data.sendExcessively, data.schoolName, data.profileRating);
          return this.user;
        })
      );
    }
  }

  public submitProfileUpdate(username: string, imageID: number, postN: boolean, deadlineN: boolean, excessiveN: boolean): Observable<any> {
    console.log("Send Excessively: " + excessiveN);
    
    return this.authService.makeRequest('post', 'updateProfile', {
      username: username,
      imageID: imageID,
      postNotifications: postN,
      deadlineNotifications: deadlineN,
      sendExcessively: excessiveN
    }).pipe(
      map(() => {
        this.user.username = username;
        this.user.imageID = imageID;
        this.user.receivePostNotifications = postN;
        this.user.receiveDeadlineNotifications = deadlineN;
        this.user.receiveExcessiveDeadlineNotifications = excessiveN;
      })
    );
  }
}
