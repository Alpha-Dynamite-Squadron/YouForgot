import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

import swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-cmp',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.css']
})

export class UserComponent implements OnInit {

  user: User;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.fetchUserInformation().subscribe((user) => {
      this.user = user;
    });
  }

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
      text: "This action will be permanent.",
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
            text: 'You have successfully deleted your account.',
            type: 'success',
            confirmButtonClass: "btn btn-info",
            buttonsStyling: false
          }
        )
      }
    })
  }

}
