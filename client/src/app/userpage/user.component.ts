import { Component } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'app-user-cmp',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.css']
})

export class UserComponent {

  userEmail: string = 'student@college.edu';
  username: string = 'Student User Name';
  userInstitution: string = 'Academic Institution Name';
  userProfileRating: string = '5.0';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  logout() {
    console.log('Logging User Out...');
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  deleteAccount() {
    console.log('Attempting to delete account...');
  }

  showSwal() {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-danger',
      cancelButtonClass: 'btn btn-info',
      confirmButtonText: 'Yes, delete it!',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        swal(
          {
            title: 'Deleted!',
            text: 'Your account has been deleted.',
            type: 'success',
            confirmButtonClass: "btn btn-info",
            buttonsStyling: false
          }
        )
      }
    })
  }

}
