import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/authentication.service';

@Component({
  selector: 'app-finish-register',
  templateUrl: './finish-register.component.html',
  styleUrls: ['./finish-register.component.css']
})
export class FinishRegisterComponent implements OnInit {

  username: string = '';
  password: string = '';
  confirmPass: string = '';
  terms: boolean = false;
  notifications: boolean  = true;

  constructor(
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
    console.log("Terms Accepted: " + this.terms);
    console.log("Notifications Enabled: " + this.notifications);
  }

  onTermsChange(e) {
    console.log(e);
    this.terms = !this.terms;
    console.log("Terms Accepted: " + this.terms);
  }

  onNotificationsChange(e) {
    console.log(e);
    this.notifications = !this.notifications;
    console.log("Notifications Enabled: " + this.notifications);
  }

  public finishRegistration() {
    console.log('Finishing Account Registration...');
    console.log("Registering with Username: " + this.username);
    console.log("Registering with Password: " + this.password);
    console.log("Registering with Confirm Password: " + this.confirmPass);
    console.log("Registering with Terms and Conditions: " + this.terms);
    console.log("Registering with Notifications: " + this.notifications);
    // this.authService.completeRegistration()
    // .subscribe(() => {
    //   this.router.navigateByUrl('/home/main');
    // }, (error) => {
    //   console.log(error);
    // });
    // this.router.navigateByUrl('/home/main');
  }
}
