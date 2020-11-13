import { Component } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-cmp',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.css']
})

export class UserComponent {

  userEmail: string = 'student@college.edu';
  username: string = 'Student User Name';
  userInstitution: string= 'Academic Institution Name';
  userProfileRating: string = '5.0';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  logout() {
    console.log('Logging User Out...');
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
