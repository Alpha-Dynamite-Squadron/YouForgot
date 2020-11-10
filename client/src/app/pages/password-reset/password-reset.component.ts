import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/authentication.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  password: string = '';
  confirmPass: string = '';
  validConfirmPasswordReset: boolean = false;
  validPasswordReset: boolean = false;
  
  constructor(
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
  }

  passwordValidationReset(e) {
    if (e.length > 8) {
      this.validPasswordReset = true;
    } else {
      this.validPasswordReset = false;
    }
  }
  confirmPasswordValidationReset(e) {
    if (this.password === e) {
      this.validConfirmPasswordReset = true;
    } else {
      this.validConfirmPasswordReset = false;
    }
  }

  resetPassword() {
    console.log('Finishing Password Reset...');
    console.log("Resetting Password to : " + this.confirmPass);
    //Add endpoint code here
    this.router.navigateByUrl('/login');
  }
}
