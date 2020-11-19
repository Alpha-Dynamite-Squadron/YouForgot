import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { PublicAssignment } from '../models/public-assignment.model';
import { User } from '../models/user.model';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;
  userCourses: Course[];
  courseAssignments: PublicAssignment[];
  currentCourseID: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  public createCourse(
    nameOfClass: string,
    imageID: number,
    instructorName: string,
    disciplineLetters: string,
    courseNumber: number,
    sectionNumber: number,
    academicTerm: string,
    academicYear: string,
  ) {
    return this.authService.makeRequest('post', 'createCourse', {
      nameOfClass: nameOfClass,
      imageID: imageID,
      instructorName: instructorName,
      disciplineLetters: disciplineLetters,
      courseNumber: courseNumber,
      sectionNumber: sectionNumber,
      academicTerm: academicTerm,
      academicYear: academicYear
    });
  }

  public createAssignment(
    sectionInstanceID: number,
    assignmentName: string,
    forGrade: boolean,
    assignmentDueDate: string
  ) {
    return this.authService.makeRequest('post', 'createAssignment', {
      sectionInstanceID: sectionInstanceID,
      assignmentName: assignmentName,
      forGrade: forGrade,
      assignmentDueDate: assignmentDueDate
    });
  }

  public fetchInstitutionCourses(): Observable<any> {
    return this.authService.requestData('get', 'getInstitutionCourses');
  }

  public fetchUserInformation(): Observable<any> {
    if (this.user) {
      return of(this.user);
    } else {
      console.log("Retrieving User Data from Server...");
      return this.authService.requestData('get', 'getUserInfo').pipe(
        map((data) => {
          this.user = new User(data.userEmail, data.username, data.imageID, data.postNotifications, data.deadlineNotifications, data.sendExcessively, data.schoolName, data.profileRating);
          return this.user;
        })
      );
    }
  }

  public fetchCourseAssignments(instanceID: number): Observable<any> {
    if (this.courseAssignments && this.currentCourseID === instanceID) {
      console.log("Same Course Selected as Previous, Passing Reference to Course Data...");
      return of(this.courseAssignments);
    } else {
      console.log("Retrieving Course Assignments from Server...");
      this.courseAssignments = [];
      return this.authService.requestData('post', 'getCourseAssignments', { sectionInstanceID: instanceID }).pipe(
        map((data) => {
          data.forEach(element => {
            this.courseAssignments.push(new PublicAssignment(
              element.nameOfClass,
              element.uploadDate,
              element.assignmentName,
              element.dueDate,
              element.forGrade,
              element.assignmentAverage,
              element.iForgotCount,
              element.assignmentID
            ));
          });
          return this.courseAssignments;
        })
      )
    }
  }

  public fetchUserCourses(): Observable<any> {
    if (this.userCourses) {
      console.log("User Course Already Retrieved, Passing Reference...");
      return of(this.userCourses);
    } else {
      console.log("Retrieving User Courses from Server...");
      this.userCourses = [];
      return this.authService.requestData('get', 'getUserCourses').pipe(
        map((data) => {
          data.forEach(element => {
            this.userCourses.push(new Course(
              element.nameOfClass,
              element.imageID,
              element.instructorName,
              element.disciplineLetters,
              element.courseNumber,
              element.sectionNumber,
              element.academicTerm,
              element.academicYear,
              element.sectionInstanceID
            ));
          });
          return this.userCourses;
        })
      );
    }
  }

  public submitProfileUpdate(username: string, imageID: number, postN: boolean, deadlineN: boolean, excessiveN: boolean): Observable<any> {
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

  public enrollUser(instanceID: number, notifications: boolean) {
    return this.authService.makeRequest('post', 'enrollUser', {
      sectionInstanceID: instanceID,
      getNotifications: notifications
    });
  }

  public unenrollUser(instanceID: number) {
    return this.authService.makeRequest('post', 'unenrollUser', {
      sectionInstanceID: instanceID
    });
  }

  public updateForgotStatus(assignmentID: number) {
    return this.authService.makeRequest('post', 'updateIForgot', {
      assignmentID: assignmentID
    });
  }


  public wipeData() {
    this.user = null;
    this.userCourses = null;
  }

  public deleteAccount() {
    this.user = null;
    this.userCourses = null;
    return this.authService.makeRequest('post', 'deleteAccount');
  }
}
