import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/authentication.service';

@Component({
  selector: 'app-finish-register',
  templateUrl: './finish-register.component.html',
  styleUrls: ['./finish-register.component.css']
})
export class FinishRegisterComponent implements OnInit {

  email: string = '';
  username: string = '';
  password: string = '';
  confirmPass: string = '';
  terms: boolean = false;
  notifications: boolean  = true;

  validConfirmPasswordRegister: boolean = false;
  validPasswordRegister: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log("Requesting Email from Server by AccessKey");
    this.authService.verifyAccessKey(this.route.snapshot.paramMap.get('id'))
      .subscribe(
        (email) => {
          console.log("Found Email: " + email);
          this.email = email;
        },
        (error) => {

        }
      );
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
    console.log("Registering with Notifications: " + this.notifications);
    this.authService.completeRegistration(
      this.email,
      this.username,
      1,
      this.password,
      this.route.snapshot.paramMap.get('id')
    ).subscribe(() => {
        this.router.navigateByUrl('/home/main');
      }, (error) => {
         console.log(error);
      });
  }

  passwordValidationRegister(e){
      if (e.length > 8) {
          this.validPasswordRegister = true;
      }else{
        this.validPasswordRegister = false;
      }
  }
  confirmPasswordValidationRegister(e){
    if (this.confirmPass === e) {
        this.validConfirmPasswordRegister = true;
    }else{
      this.validConfirmPasswordRegister = false;
    }
  }
}
